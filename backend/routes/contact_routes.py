from flask import Blueprint, request, jsonify
from flask_mail import Message
from extensions import mail

contact_bp = Blueprint("contact", __name__)

@contact_bp.route("", methods=["POST"])
def send_contact_email():

    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        if not name or not email or not message:
            return jsonify({
                "success": False,
                "error": "All fields are required"
            }), 400

        msg = Message(
            subject="Cyber Defense Contact Form",
            sender="saimazaheer028@gmail.com",
            recipients=["saimazaheer228@gmail.com"],
            reply_to=email
        )

        msg.body = f"""
Name: {name}

Email: {email}

Message:
{message}
"""

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "Email sent successfully"
        }), 200

    except Exception as e:
        print("CONTACT ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500