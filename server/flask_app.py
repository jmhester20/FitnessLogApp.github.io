# server/flask_app.py

import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# CORS: allow frontend
CORS(app, origins=["https://fitnesslogapp-github-io-1.onrender.com"])

# JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Bcrypt
bcrypt = Bcrypt(app)

# MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
db = client["yourDatabaseName"]  # Replace with actual DB name

# Make db and bcrypt available globally (you already import from here)
from flask_app import app as app_instance
app_instance.db = db
app_instance.bcrypt = bcrypt

# Import and register routes
from routes.auth_routes import auth_bp
from routes.workout_routes import workout_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(workout_bp, url_prefix="/api/workouts")
