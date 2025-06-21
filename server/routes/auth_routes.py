from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_app import db, bcrypt

auth_bp = Blueprint("auth_bp", __name__)

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        print(">> Register data:", data)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            print(">> Missing username or password")
            return jsonify({"message": "Username and password required"}), 400

        if db.users.find_one({"username": username}):
            print(">> Username already exists")
            return jsonify({"message": "Username already exists"}), 409

        hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
        db.users.insert_one({
            "username": username,
            "password": hashed_pw
        })

        print(">> User registered successfully")
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(">> Error during registration:", str(e))
        return jsonify({"message": "Internal server error"}), 500


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print(">> Login data:", data)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            print(">> Missing username or password")
            return jsonify({"message": "Username and password required"}), 400

        user = db.users.find_one({"username": username})
        if not user:
            print(">> User not found")
            return jsonify({"message": "Invalid credentials"}), 401

        if not bcrypt.check_password_hash(user["password"], password):
            print(">> Incorrect password")
            return jsonify({"message": "Invalid credentials"}), 401

        access_token = create_access_token(identity=str(user["_id"]))
        print(">> Login successful")
        return jsonify({"token": access_token}), 200
    

    except Exception as e:
        print(">> Error during login:", str(e))
        return jsonify({"message": "Internal server error"}), 500
