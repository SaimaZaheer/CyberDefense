import pickle
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from backend.ml.lexical_features import extract_lexical_features

with open(os.path.join(BASE_DIR, 'backend', 'ml', 'url_model.pkl'), 'rb') as f:
    model = pickle.load(f)

urls = [
    "https://google.com",
    "https://www.google.com",
    "https://github.com",
    "https://www.github.com",
    "https://openai.com",
    "https://facebook.com",
    "https://www.facebook.com",
    "https://google-login-check-security.com",
    "http://paypal-verification-alert.net",
    "http://192.168.1.1/login.php?verify=1",
    "http://172.16.0.4/secure/account"
]

with open(os.path.join(BASE_DIR, 'test_output_py.txt'), 'w') as out_f:
    for u in urls:
        feat = extract_lexical_features(u)
        proba = model.predict_proba(feat)[0]
        classes = model.classes_
        prob_dict = dict(zip(classes, proba))
        malicious_prob = prob_dict.get(1, 0)
        score = int(malicious_prob * 100)
            
        risk_level = "Unknown"
        if score >= 70:
            risk_level = "Malicious"
        elif score >= 31:
            risk_level = "Suspicious"
        else:
            risk_level = "Safe"
            
        out_f.write(f"[{risk_level}] ({score}) {u}\n")
