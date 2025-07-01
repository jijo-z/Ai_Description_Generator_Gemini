from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

@app.route('/api/description', methods=['POST'])
def describe_word():
    data = request.get_json()
    word = data.get("word", "")

    if not word:
        return jsonify({"error": "No word provided"}), 400

    try:
        prompt = f"Explain the word '{word}'."
        response = model.generate_content(prompt)
        return jsonify({
            "word": word,
            "explanation": response.text.strip()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summarize-gemini', methods=['POST'])
def get_summary_gemini():
    data = request.get_json()
    description1 = data.get('description1')

    if not description1:
        return jsonify({'error': 'No description provided'}), 400

    prompt1 = f"Provide a concise technical summary of the following description:\n\n{description1}"

    try:
        summary_response = model.generate_content(prompt1)
        description2 = summary_response.text.strip() if hasattr(summary_response, 'text') else "No summary generated"
        return jsonify({'description2': description2})
    except Exception as e:
        print(f'Error fetching summary: {e}')
        return jsonify({'error': f'Failed to fetch summary: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)
