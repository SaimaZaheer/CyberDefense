from flask import request, jsonify
from flask_bcrypt import Bcrypt
from models import db
from models.user import User
from utils.validators import validate_email, validate_password_strength
import jwt
from config.settings import Config
import datetime

bcrypt = Bcrypt()

def register():
    try:
        data = request.get_json(silent=True) or {}
        name = data.get('name') or "User"
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Missing required fields."}), 400

        if not validate_email(email):
            return jsonify({"error": "Invalid email format."}), 400

        if not validate_password_strength(password):
            return jsonify({"error": "Password must be at least 6 characters."}), 400

        if User.query.filter_by(email=email).first() is not None:
            return jsonify({"error": "Email is already registered."}), 409

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        new_user = User(
            name=name,
            email=email,
            password=hashed_password
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print("DB Error during register:", str(e))
            return jsonify({"error": "Database error during registration."}), 500

        return jsonify({"message": "User registered successfully.", "user": new_user.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An internal error occurred during registration."}), 500

def login():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Missing required fields."}), 400

        user = User.query.filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password, password):
            # Generate JWT token
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, Config.SECRET_KEY, algorithm='HS256')

            return jsonify({
                "message": "Login successful.",
                "access_token": token,
                "user": user.to_dict()
            }), 200
        
        return jsonify({"error": "Invalid email or password."}), 401

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An internal error occurred during login."}), 500
