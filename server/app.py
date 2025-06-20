# server/app.py

from flask_app import app
from routes.auth_routes import auth_bp
from routes.workout_routes import workout_bp
import os

# Register blueprints
app.register_blueprint(auth_bp,    url_prefix="/api/auth")
app.register_blueprint(workout_bp, url_prefix="/api/workouts")

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        debug=True
    )
