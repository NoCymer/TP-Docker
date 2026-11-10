
from flask import Flask, jsonify
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

app = Flask(__name__)

MONGO_URI = os.environ["MONGO_URI"]
MONGO_DB_NAME = os.environ["MONGO_DB_NAME"]

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client[MONGO_DB_NAME]


@app.route("/", methods=["GET"])
def hello_world():
    return jsonify({
        "message": "Hello, World!"
    })


@app.route("/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")

        return jsonify({
            "status": "ok",
            "mongodb": "connected"
        }), 200

    except ConnectionFailure:
        return jsonify({
            "status": "error",
            "mongodb": "disconnected"
        }), 503


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
