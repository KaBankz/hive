from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import os
from PIL import Image
import base64
from openai import OpenAI
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

load_dotenv(dotenv_path=Path("../.env.local"))

app = Flask(__name__)
CORS(app)

app_dir = Path(__file__).parent
app.config["UPLOAD_FOLDER"] = str(app_dir / "uploads")
app.config["OUTPUT_FOLDER"] = str(app_dir / "output_images")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
os.makedirs(app.config["OUTPUT_FOLDER"], exist_ok=True)

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OpenAI API key not found. Please check your .env file.")

client = OpenAI(api_key=openai_api_key)

gpt_model = "gpt-4o-mini"

ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename):
    """Check if a file is allowed based on its extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def encode_image_to_base64(image_path):
    """Convert an image to a Base64-encoded string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def convert_page_to_image(page, output_folder, page_number, dpi=150):
    """Convert a single page to an image."""
    pix = page.get_pixmap(dpi=dpi)
    image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    image_filename = f"page_{page_number + 1}.jpg"
    image_path = os.path.join(output_folder, image_filename)
    image.save(image_path, "JPEG")
    return image_path


def convert_pdf_to_images(pdf_path, output_folder, dpi=150):
    """Convert a PDF file into images (one per page) using threading."""
    pdf_document = fitz.open(pdf_path)
    with ThreadPoolExecutor() as executor:
        image_paths = list(
            executor.map(
                lambda page_number: convert_page_to_image(
                    pdf_document[page_number], output_folder, page_number, dpi
                ),
                range(len(pdf_document)),
            )
        )
    return image_paths


def process_images_with_gpt(image_paths, question):
    """Send images and a question to GPT-4 Vision for analysis in a single batch."""
    message_content = [{"type": "text", "text": question}]
    batch_base64_images = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{encode_image_to_base64(path)}"
            },
        }
        for path in image_paths
    ]
    message_content.extend(batch_base64_images)

    try:
        response = client.chat.completions.create(
            model=gpt_model,
            messages=[{"role": "user", "content": message_content}],
            max_tokens=1000,
        )
        return f"### Insights\n\n{response.choices[0].message.content}"
    except Exception as e:
        return f"Error during GPT-4 Vision analysis: {e}"


@app.route("/")
def hello_world():
    """Basic endpoint to check if the app is running."""
    return "Hello, World! The Flask app is running."


@app.route("/ask", methods=["POST"])
def ask():
    """Handle questions, with optional PDF upload for document analysis."""
    question = request.form.get("question", "")
    image_paths = []

    if "file" in request.files:
        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file."}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed."}), 400

        filename = secure_filename(file.filename)
        pdf_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(pdf_path)

        try:
            image_paths = convert_pdf_to_images(pdf_path, app.config["OUTPUT_FOLDER"])
        except Exception as e:
            return jsonify({"error": f"Error processing PDF: {e}"}), 500

        os.remove(pdf_path)

    try:
        if image_paths:
            answer = process_images_with_gpt(
                image_paths, question or "Analyze this document."
            )
        else:
            if question:
                response = client.chat.completions.create(
                    model=gpt_model,
                    messages=[{"role": "user", "content": question}],
                    max_tokens=1000,
                )
                answer = response.choices[0].message.content
            else:
                return jsonify(
                    {"error": "No question or file provided for processing."}
                ), 400
    except Exception as e:
        return jsonify({"error": f"Error during GPT-4 Vision analysis: {e}"}), 500

    for image_path in image_paths:
        os.remove(image_path)

    return jsonify({"question": question, "answer": answer}), 200


@app.route("/upload-and-analyze", methods=["POST"])
def upload_and_analyze():
    """Endpoint for uploading a PDF and generating insights automatically."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are allowed."}), 400

    pdf_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(pdf_path)

    try:
        image_paths = convert_pdf_to_images(pdf_path, app.config["OUTPUT_FOLDER"])
    except Exception as e:
        return jsonify({"error": f"Error processing PDF: {e}"}), 500

    question = "Analyze this document and provide breif and short and bullet point responce of insights and warnings."
    insights = process_images_with_gpt(image_paths, question)

    for image_path in image_paths:
        os.remove(image_path)

    os.remove(pdf_path)

    return jsonify(
        {"message": "PDF uploaded and processed successfully.", "insights": insights}
    ), 200


if __name__ == "__main__":
    import logging
    from waitress import serve
    from paste.translogger import TransLogger

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    # Wrap the Flask app with TransLogger for request logging
    logged_app = TransLogger(app, setup_console_handler=True)

    # Run with waitress
    serve(logged_app, host="0.0.0.0", port=3001, _quiet=False)
