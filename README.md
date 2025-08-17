# hackthon-
Overview
This project is a web-based application designed to facilitate emergency reporting, ambulance dispatching, real-time monitoring, and resource management. It integrates AI capabilities through a chatbot powered by Google's Gemini API to provide user assistance, medical advice, and guidance during emergencies. The system includes features for reporting incidents, locating nearest hospitals, tracking ambulances, and filing police complaints if needed.
The application is built for quick response in critical situations like medical emergencies, road accidents, and other incidents. It emphasizes user-friendly interfaces, GPS integration, and AI-driven interactions to save lives.
Features

Emergency Reporting: Users can report incidents with details like location (manual or auto-detected), emergency type (medical, accident, etc.), severity, number of people involved, and additional notes.
Ambulance Dispatch: Automatically dispatches units to the nearest hospital based on reported location.
Real-Time Monitoring: Track ambulance locations and ETAs via a monitoring dashboard.
Maps Integration: Displays nearest hospitals and routes using Google Maps API.
Police Complaint Filing: Option to file complaints alongside medical emergencies.
AI Chatbot: An embedded chatbot that provides calm, reassuring guidance, medical precautions, first aid tips, and general knowledge. It advises users to call emergency services in urgent cases.
Firebase Integration: For real-time database storage and authentication.
Precautionary Advice: Includes a dataset of hygiene, preventive health, first aid, and emergency precautions.

Technologies Used

Frontend: HTML5, CSS3, JavaScript (with Font Awesome icons).
Backend: Python with Flask framework for the chatbot server.
APIs:

Google Gemini API for AI chatbot responses.
Google Maps API for location services and hospital routing.
Firebase Firestore for database and real-time updates.


Other Libraries:

Flask-CORS for handling cross-origin requests.
Requests for API calls in Python.


Deployment: Local server (Flask) and static HTML files.

Prerequisites

Python 3.x installed.
Google API key for Gemini and Maps (stored in api_key.txt and firebase-config.js).
Firebase project setup with Firestore enabled.
Web browser (Chrome recommended for best compatibility).
