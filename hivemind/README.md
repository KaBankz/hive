# Hivemind Chatbot

## Description

Hivemind is the chatbot for Hive, construction reporting redefined.

# Flask PDF Analyzer with GPT-4 Vision

This is a Flask-based API that allows users to upload PDF files, convert them into images, and process the images using OpenAI's GPT-4 Vision model. The application provides insights based on the extracted images and can also answer user questions related to the uploaded documents.

## Features

- Upload a PDF file and convert it into images
- Process images using GPT-4 Vision
- Answer questions related to uploaded documents
- CORS enabled for cross-origin requests
- Threading for efficient PDF processing

## API Endpoints

#### 1. **Ask GPT-4 Vision**

- **Endpoint:** `POST /ask`
- **Description:** Allows users to ask a question with an optional PDF upload.
- **Request:**
  - `question` (form-data) - The question to ask.
  - `file` (form-data) - Optional PDF file.
- **Response Example:**
  ```json
  {
    "question": "Summarize the document.",
    "answer": "### Insights\n\n- The document discusses...\n- Key points include..."
  }
  ```

#### 2. **Upload and Analyze a PDF**

- **Endpoint:** `POST /upload-and-analyze`
- **Description:** Upload a PDF, process it, and receive insights.
- **Request:**
  - `file` (form-data) - The PDF file.
- **Response Example:**
  ```json
  {
    "message": "PDF uploaded and processed successfully.",
    "insights": "### Insights\n\n- Important points...\n- Warnings..."
  }
  ```

## Dependencies

- Flask
- Flask-CORS
- PyMuPDF (fitz)
- Pillow
- OpenAI API
- python-dotenv
- Werkzeug
