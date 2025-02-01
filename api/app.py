from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import os
from PIL import Image
import base64
from openai import OpenAI
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from io import BytesIO
import logging
import traceback
from time import time
from paste.translogger import TransLogger

# Simple logging configuration
log_format = "%(asctime)s [%(levelname)s] %(message)s"
date_format = "%Y-%m-%d %H:%M:%S"

logging.basicConfig(
    level=logging.INFO,
    format=log_format,
    datefmt=date_format,
)

# Ensure all loggers use the same format
for name in logging.root.manager.loggerDict:
    logging.getLogger(name).handlers = []
    logging.getLogger(name).propagate = True

logger = logging.getLogger(__name__)

current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
dotenv_path = parent_dir / ".env.local"
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app)

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.error("OpenAI API key not found in environment variables")
    raise ValueError("OpenAI API key not found. Please check your .env.local file.")

client = OpenAI(api_key=openai_api_key)

gpt_model = "gpt-4o-mini"

ALLOWED_EXTENSIONS = {"pdf"}


def handle_error(error, context=""):
    """Unified error handling function that logs errors and returns safe messages."""
    error_id = str(hash(time()))[:8]
    logger.error(f"Error ID: {error_id} | Context: {context} | Error: {str(error)}")
    logger.debug(f"Error ID: {error_id} | Traceback: {traceback.format_exc()}")
    return {
        "error": "An internal error occurred",
        "error_id": error_id,
        "message": "Please contact support with this error ID if the problem persists",
    }


def allowed_file(filename):
    """Check if a file is allowed based on its extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def convert_image_to_base64(image):
    """Convert a PIL Image to a Base64-encoded string."""
    try:
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")
    except Exception as e:
        logger.error(f"Failed to convert image to base64: {str(e)}")
        raise


def convert_page_to_image(page, dpi=150):
    """Convert a single page to an image in memory."""
    try:
        pix = page.get_pixmap(dpi=dpi)
        return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    except Exception as e:
        logger.error(f"Failed to convert page to image: {str(e)}")
        raise


def convert_pdf_to_images(pdf_data, dpi=150):
    """Convert a PDF file into images (one per page) using threading."""
    try:
        pdf_stream = BytesIO(pdf_data)
        pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")
        logger.info(f"Processing PDF with {len(pdf_document)} pages")

        with ThreadPoolExecutor() as executor:
            images = list(
                executor.map(
                    lambda page_number: convert_page_to_image(
                        pdf_document[page_number], dpi
                    ),
                    range(len(pdf_document)),
                )
            )
        pdf_document.close()
        return images
    except Exception as e:
        logger.error(f"Failed to convert PDF to images: {str(e)}")
        raise


def process_images_with_gpt(images, question):
    """Send images and a question to GPT-4 Vision for analysis in a single batch."""
    try:
        logger.info(f"Processing {len(images)} images with GPT-4 Vision")
        message_content = [{"type": "text", "text": question}]
        batch_base64_images = [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{convert_image_to_base64(image)}"
                },
            }
            for image in images
        ]
        message_content.extend(batch_base64_images)

        response = client.chat.completions.create(
            model=gpt_model,
            messages=[{"role": "user", "content": message_content}],
            max_tokens=1000,
        )
        return f"### Insights\n\n{response.choices[0].message.content}"
    except Exception as e:
        logger.error(f"Failed to process images with GPT: {str(e)}")
        raise


@app.route("/")
def hello_world():
    """Basic endpoint to check if the app is running."""
    return "Hello, World! The Flask app is running."


@app.route("/ask", methods=["POST"])
def ask():
    """Handle questions, with optional PDF upload for document analysis."""
    try:
        question = request.form.get("question", "")
        images = []

        if "file" in request.files:
            file = request.files["file"]
            logger.info(f"Processing file upload: {file.filename}")

            if file.filename == "":
                return jsonify({"error": "No selected file"}), 400

            if not allowed_file(file.filename):
                return jsonify({"error": "Only PDF files are allowed"}), 400

            try:
                pdf_data = file.read()
                images = convert_pdf_to_images(pdf_data)
            except Exception as e:
                error_response = handle_error(e, "PDF processing")
                return jsonify(error_response), 500

        try:
            if images:
                answer = process_images_with_gpt(
                    images, question or "Analyze this document."
                )
            else:
                if question:
                    logger.info("Processing text-only question")
                    response = client.chat.completions.create(
                        model=gpt_model,
                        messages=[{"role": "user", "content": question}],
                        max_tokens=1000,
                    )
                    answer = response.choices[0].message.content
                else:
                    return jsonify({"error": "No question or file provided"}), 400
        except Exception as e:
            error_response = handle_error(e, "GPT processing")
            return jsonify(error_response), 500

        return jsonify({"question": question, "answer": answer}), 200

    except Exception as e:
        error_response = handle_error(e, "ask endpoint")
        return jsonify(error_response), 500


@app.route("/upload-and-analyze", methods=["POST"])
def upload_and_analyze():
    """Endpoint for uploading a PDF and generating insights automatically."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        logger.info(f"Processing file upload: {file.filename}")

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed"}), 400

        try:
            pdf_data = file.read()
            images = convert_pdf_to_images(pdf_data)
        except Exception as e:
            error_response = handle_error(e, "PDF processing")
            return jsonify(error_response), 500

        try:
            question = "Analyze this document and provide breif and short and bullet point responce of insights and warnings."
            insights = process_images_with_gpt(images, question)
        except Exception as e:
            error_response = handle_error(e, "GPT processing")
            return jsonify(error_response), 500

        return jsonify(
            {"message": "PDF uploaded and processed successfully", "insights": insights}
        ), 200

    except Exception as e:
        error_response = handle_error(e, "upload-and-analyze endpoint")
        return jsonify(error_response), 500


if __name__ == "__main__":
    from waitress import serve

    class RequestLogger(TransLogger):
        def write_log(self, environ, method, req_uri, start, status, bytes):
            msg = f"{environ.get('REMOTE_ADDR', '-')} - {method} {req_uri} - {status}"
            self.logger.info(msg)

    logged_app = RequestLogger(app, setup_console_handler=False)
    logger.info("Starting server on port 3001")
    serve(logged_app, host="0.0.0.0", port=3001, _quiet=True)
