from flask import Flask

app = Flask(__name__)  # <== THIS MUST EXIST

print("🔥 FLASK APP LOADED 🔥")

@app.route("/ping")
def ping():
    return {"message": "pong"}, 200
