from flask import Blueprint, jsonify, request
import stripe
from utils.auth_middleware import token_required
from models import db

test_bp = Blueprint('test', __name__)

@test_bp.route('/create-payment-intent', methods=['POST'])
@token_required
def create_payment_intent(current_user):
    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=999, # $9.99
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return jsonify({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return jsonify(error=str(e)), 403

@test_bp.route('/make-premium', methods=['PUT'])
@token_required
def make_premium(current_user):
    try:
        current_user.is_premium = True
        db.session.commit()
        return jsonify({"message": "User upgraded to premium"}), 200
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to upgrade user."}), 500
