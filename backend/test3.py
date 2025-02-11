from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Ensure 'excel' directory exists
UPLOAD_FOLDER = "excel"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Route to handle file upload
@app.route("/upload", methods=["POST"])
def upload_file():
    if "files" not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist("files")  # Handle multiple file uploads
    saved_files = []

    for file in files:
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)
        saved_files.append(file.filename)

    return jsonify({"message": "Files uploaded successfully", "files": saved_files}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
