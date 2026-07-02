from flask import Blueprint, jsonify, request
from utils.auth_middleware import token_required
from models.scan import Scan
from models import db

history_bp = Blueprint('history', __name__)

@history_bp.route('/', methods=['GET'])
@token_required
def history(current_user):
    try:
        print(f"[DEBUG] Fetching history for User ID: {current_user.id}")
        risk_level = request.args.get('risk_level')
        
        query = Scan.query.filter_by(user_id=current_user.id)
        if risk_level:
            query = query.filter_by(risk_level=risk_level)
            
        scans = query.order_by(Scan.created_at.desc()).all()
        print(f"[DEBUG] Successfully fetched {len(scans)} scans for User ID: {current_user.id}")
        return jsonify({"scans": [scan.to_dict() for scan in scans]}), 200
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        print("ERROR fetching history:", str(e))
        return jsonify({"error": "An internal server error occurred fetching history.", "scans": []}), 500
