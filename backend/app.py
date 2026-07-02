from flask import Flask
import os
from dotenv import load_dotenv
load_dotenv()
import stripe
from flask_cors import CORS
from config.settings import Config
from models import db
from routes.auth_routes import auth_bp
from controllers.auth_controller import bcrypt
from models.user import User
from models.scan import Scan
from routes.contact_routes import contact_bp
from extensions import mail

app = Flask(__name__)
# Enable CORS for the frontend connection
CORS(
    app,
    resources={r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ]
    }},
    supports_credentials=True
)

# Load configuration
app.config.from_object(Config)
mail.init_app(app)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Initialize database & bcrypt
db.init_app(app)
bcrypt.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

from routes.scan_routes import scan_bp
from routes.history_routes import history_bp
from routes.test_routes import test_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(scan_bp, url_prefix='/api/scan')
app.register_blueprint(history_bp, url_prefix='/api/history')
app.register_blueprint(test_bp, url_prefix='/api/test')
app.register_blueprint(contact_bp, url_prefix='/api/contact')

# Basic health check route
@app.route("/", methods=["GET"])
def index():
    return {"status": "ok", "message": "Cyber Defense Backend API is running."}

@app.route("/api/debug/scans", methods=["GET"])
def get_debug_scans():
    scans = Scan.query.all()
    return {"scans": [scan.to_dict() for scan in scans]}

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=5000)
