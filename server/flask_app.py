from flask import Flask

app = Flask(__name__)

@app.route("/ping")
def ping():
    return {"message": "pong"}, 200
