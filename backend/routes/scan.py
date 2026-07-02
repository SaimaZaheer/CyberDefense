from flask import Blueprint, request, jsonify
from db import connect_db

def save_scan(url, risk, score):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO scans (url, risk, score) VALUES (?, ?, ?)",
        (url, risk, score)
    )

    conn.commit()
    conn.close()
scan_bp = Blueprint("scan", __name__)

def check_url(url):
    score = 0

    # rule 1: http (not secure)
    if url.startswith("http://"):
        score += 30

    # rule 2: suspicious keywords
    suspicious_words = ["login", "verify", "bank", "secure", "account"]
    for word in suspicious_words:
        if word in url.lower():
            score += 10

    # rule 3: too many dots
    if url.count(".") > 3:
        score += 20

    # classify
    if score < 30:
        risk = "Safe"
    elif score < 70:
        risk = "Suspicious"
    else:
        risk = "Malicious"

    return score, risk


@scan_bp.route("/scan/url", methods=["POST"])
def scan_url():
    data = request.get_json()
    url = data.get("url")

    score, risk = check_url(url)

    return jsonify({
        "url": url,
        "risk": risk,
        "score": score,
        "message": f"This URL is {risk}"
    })