import sys
import os
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, 'backend'))

try:
    from backend.controllers.scan_controller import generate_behavior_analysis

    tests = [
       ("sms", "hey wanna grab lunch tomorrow?", "Safe", 10),
       ("email", "URGENT: Verify your bank password immediately.", "Malicious", 95),
       ("url", "https://github.com", "Safe", 0),
       ("url", "http://paypal-account-verify.freebonus.ru/login", "Malicious", 98)
    ]

    with open(os.path.join(BASE_DIR, "test_behavior_out.txt"), "w") as f:
        for scan_type, content, risk, score in tests:
            f.write(f"[{scan_type.upper()}] {content}\n")
            f.write(generate_behavior_analysis(scan_type, content, risk, score) + "\n")
            f.write("-" * 50 + "\n")
            f.flush()
except Exception as e:
    with open(os.path.join(BASE_DIR, "test_behavior_out.txt"), "w") as f:
        f.write("ERROR:\n" + traceback.format_exc())
