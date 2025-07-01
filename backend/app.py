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

if __name__ == "__main__":
    app.run(debug=True)
