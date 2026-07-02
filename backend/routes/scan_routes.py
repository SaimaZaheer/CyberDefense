from flask import Blueprint
from controllers.scan_controller import scan
from utils.auth_middleware import token_required

scan_bp = Blueprint('scan', __name__)

@scan_bp.route('/', methods=['POST'])
@token_required
def perform_scan(current_user):
    return scan(current_user)
