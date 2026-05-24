from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# ---------------- ROUTES ----------------
from routes.Task.task_routes import task_routes
from routes.Auth.auth_routes import auth_routes
from routes.AI.ai_routes import ai_routes
from routes.submission.submission_routes import submission_routes


load_dotenv()

# ---------------- APP ----------------
app = Flask(__name__)


CORS(app)


app.register_blueprint(task_routes)
app.register_blueprint(auth_routes)
app.register_blueprint(ai_routes)
app.register_blueprint(submission_routes)


@app.route("/")
def home():

    return {
        "message": "Backend running successfully"
    }

# ---------------- START SERVER ----------------
if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )