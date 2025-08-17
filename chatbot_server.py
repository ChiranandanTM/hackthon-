# chatbot_server.py (Gemini Version - Final Fix)
# This script is enhanced to send specific API errors back to the frontend.

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
# Make the CORS (Cross-Origin Resource Sharing) settings more explicit.
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Configuration ---
# Load the Gemini API key from a file for security.
try:
    with open("api_key.txt", "r") as f:
        GEMINI_API_KEY = f.read().strip()
    if not GEMINI_API_KEY:
        print("ERROR: 'api_key.txt' is empty. Please add your Gemini API key.")
        exit()
except FileNotFoundError:
    print("ERROR: 'api_key.txt' not found. Please create this file and add your Gemini API key.")
    exit()

# The URL for the Gemini API (MODIFIED: Reverted to v1beta and gemini-pro)
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

# --- Server Test Route ---
@app.route('/', methods=['GET'])
def index():
    """A simple route to test if the server is running."""
    print("SUCCESS: The server test URL was accessed correctly.")
    return "Gemini chatbot server is running!"

# --- Chatbot Logic ---
@app.route('/chat', methods=['POST'])
def chat():
    """
    This function handles the chat requests from the website.
    """
    print("\n--- Received a new request on /chat ---")
    try:
        user_message = request.json.get("message")
        page_context = request.json.get("context", "the user is on an emergency services website")
        print(f"Received message: '{user_message}'")

        if not user_message:
            return jsonify({"error": "Message cannot be empty."}), 400

        prompt = f"""
        Context: {page_context}. You are a helpful assistant on an emergency reporting website. Your primary goals are to be calm, reassuring, and helpful. Guide users on how to use the site. IMPORTANT: If the user seems to be in a real, urgent emergency, you MUST immediately advise them to contact their local emergency services by phone.
        User's message: "{user_message}"
        Your response:
        """
        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        print("Sending request to Gemini API...")
        response = requests.post(GEMINI_API_URL, json=payload)

        # **IMPROVED ERROR HANDLING**
        # If the response status is not OK (200), extract the specific error from Google.
        if response.status_code != 200:
            error_details = response.json()
            # Extract the specific error message from Google's response
            error_message = error_details.get('error', {}).get('message', 'An unknown API error occurred.')
            print(f"ERROR from Gemini API. Status: {response.status_code}, Details: {error_message}")
            # Send the specific error message back to the chatbot UI
            return jsonify({"error": f"API Error: {error_message}"}), response.status_code

        result = response.json()
        # NOTE: The structure of the v1beta response is slightly different.
        chatbot_response = result['candidates'][0]['content']['parts'][0]['text']
        print(f"Received reply from Gemini: '{chatbot_response[:80]}...'")
        return jsonify({"reply": chatbot_response})

    except requests.exceptions.RequestException as e:
        print(f"Network Request Error: {e}")
        return jsonify({"error": "Network error: Could not connect to Google's services."}), 500
    except (KeyError, IndexError) as e:
        print(f"Error parsing Gemini response: {e}")
        print(f"Full response received: {result}")
        return jsonify({"error": "Received an unexpected response format from the AI service."}), 500
    except Exception as e:
        print(f"An unexpected server error occurred: {e}")
        return jsonify({"error": "An internal server error occurred on the Python server."}), 500

# --- Server Start ---
if __name__ == '__main__':
    print("--- Starting the Gemini chatbot server ---")
    print("Your Gemini API Key is loaded.")
    print("Test the server by visiting http://127.0.0.1:5000/ in your browser.")
    print("-------------------------------------------------")
    app.run(host='0.0.0.0', port=5000, debug=True)