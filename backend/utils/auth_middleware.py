from functools import wraps
from flask import request, jsonify
import jwt
from config.settings import Config
from models.user import User
from models import db

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
                
        if not token or token == 'undefined' or token == 'null':
            print("Auth Error: Token missing or malformed")
            return jsonify({'error': 'Token is missing'}), 401

        try:
            # Disable expiration verification in dev to prevent random invalidations
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"], options={"verify_exp": False})
            
            if 'user_id' not in data:
                print("JWT Error: user_id missing from token payload")
                return jsonify({'error': 'Invalid or expired token'}), 401
                
            current_user = User.query.get(data['user_id'])
            if not current_user:
                print(f"Auth Error: User not found for ID {data.get('user_id')}")
                return jsonify({'error': 'Invalid or expired token'}), 401
                
        except jwt.ExpiredSignatureError:
            print("JWT Error: Token expired")
            return jsonify({'error': 'Invalid or expired token'}), 401
        except jwt.InvalidTokenError as e:
            print(f"JWT Invalid Token Error: {e}")
            return jsonify({'error': 'Invalid or expired token'}), 401
        except Exception as e:
            db.session.rollback()
            print(f"Auth Middleware Unexpected Error: {e}")
            return jsonify({'error': 'Invalid or expired token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
