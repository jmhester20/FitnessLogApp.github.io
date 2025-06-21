# server/flask_app.py

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Allow frontend access via CORS
CORS(app, origins=["https://fitnesslogapp-github-io-1.onrender.com"])
                
                    

# JWT setup
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Bcrypt for password hashing
bcrypt = Bcrypt(app)

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000, tls=True, tlsAllowInvalidCertificates=True)
db = client["fitnesslog"]  #  replace with your actual DB name

# Register route blueprints
from routes.auth_routes import auth_bp
from routes.workout_routes import workout_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(workout_bp, url_prefix="/api/workouts")

# Health check route
@app.route("/ping")
def ping():
    return jsonify({"message": "pong"}), 200
