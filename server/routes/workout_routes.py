from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_app import db
from bson.objectid import ObjectId

workout_bp = Blueprint("workouts", __name__)

@workout_bp.route("/", methods=["GET"])
@jwt_required()
def get_workouts():
    user_id = get_jwt_identity()
    cursor = db.workouts.find({"user_id": user_id})
    workouts = []
    for w in cursor:
        w["_id"] = str(w["_id"])
        workouts.append(w)
    return jsonify(workouts), 200

@workout_bp.route("/", methods=["POST"])
@jwt_required()
def create_workout():
    user_id = get_jwt_identity()
    data = request.get_json()

    workout = {
        "user_id": user_id,
        "date": data.get("date"),
        "exercise": data.get("exercise"),
    }

    if data.get("time") is not None:
        workout["time"] = float(data.get("time"))
    else:
        workout["sets"] = int(data.get("sets"))
        workout["reps"] = int(data.get("reps"))
        workout["weights"] = data.get("weights", [])

    result = db.workouts.insert_one(workout)
    workout["_id"] = str(result.inserted_id)
    return jsonify(workout), 201

@workout_bp.route("/<string:w_id>", methods=["GET"])
@jwt_required()
def get_workout(w_id):
    user_id = get_jwt_identity()
    w = db.workouts.find_one({"_id": ObjectId(w_id), "user_id": user_id})
    if not w:
        return jsonify({"msg": "Not found"}), 404
    w["_id"] = str(w["_id"])
    return jsonify(w), 200

@workout_bp.route("/<string:w_id>", methods=["PUT"])
@jwt_required()
def update_workout(w_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    result = db.workouts.update_one(
        {"_id": ObjectId(w_id), "user_id": user_id},
        {"$set": data}
    )
    if result.matched_count == 0:
        return jsonify({"msg": "Not found"}), 404
    return jsonify({"msg": "Workout updated"}), 200

@workout_bp.route("/<string:w_id>", methods=["DELETE"])
@jwt_required()
def delete_workout(w_id):
    user_id = get_jwt_identity()
    result = db.workouts.delete_one({"_id": ObjectId(w_id), "user_id": user_id})
    if result.deleted_count == 0:
        return jsonify({"msg": "Not found"}), 404
    return jsonify({"msg": "Workout deleted"}), 200
