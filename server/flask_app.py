# server/flask_app.py

import os
from flask import Flask, send_from_directory, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

# load environment variables from .env
load_dotenv()

# serve React build from client/build
app = Flask(
    __name__,
    static_folder="../client/build",  # <-- React’s production files
    static_url_path=""                # <-- so "/" serves index.html
)

# JWT config
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# extensions
CORS(app)
jwt    = JWTManager(app)
bcrypt = Bcrypt(app)

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
client    = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
db        = client["yourDatabaseName"]  # <-- replace with your actual DB name

# register your blueprints
from routes.auth_routes import auth_bp
from routes.workout_routes import workout_bp

app.register_blueprint(auth_bp,    url_prefix="/api/auth")
app.register_blueprint(workout_bp, url_prefix="/api/workouts")

# catch-all: serve React’s index.html on any non-/api route
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    build_dir = app.static_folder
    requested = os.path.join(build_dir, path)

    # if the file exists (e.g. JS, CSS), serve it
    if path and os.path.exists(requested):
        return send_from_directory(build_dir, path)

    # otherwise serve the React app’s index.html
    index = os.path.join(build_dir, "index.html")
    if os.path.exists(index):
        return send_from_directory(build_dir, "index.html")

    # no build output found—404
    abort(404)

if __name__ == "__main__":
    # local dev only
    from server import app as _app  # if you’ve structured differently, adjust
    _app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)), debug=True)
