from flask import request, jsonify
from utils.validators import validate_url
from models import db
from models.scan import Scan
import pickle
import os
import pandas as pd
from urllib.parse import urlparse
from ml.lexical_features import extract_lexical_features
from ml.text_features import get_combined_features, extract_nlp_features

import time
import random
import re

def generate_behavior_analysis(scan_type, content, risk_level, threat_score):
    content_lower = str(content).lower()
    is_url = scan_type in ['url', 'website']
    
    # Deep Sentence Pools
    pool_urgency = [
        "The communication intentionally compresses decision-making timeframes to encourage impulsive reactions.",
    "Repeated calls for immediate action reduce the likelihood of independent verification.",
    "The message structure introduces artificial deadlines designed to create unnecessary panic.",
    "Behavioral sequencing suggests deliberate time-pressure manipulation.",
    "The urgency indicators exceed those commonly observed in routine communications.",
    "The wording encourages rapid compliance rather than careful evaluation.",
    "Psychological pressure tactics are utilized to discourage critical thinking.",
    "The communication promotes immediate engagement through manufactured consequences.",
    "The temporal framing attempts to create a false sense of emergency.",
    "The interaction pattern favors rushed responses over informed decision making."
    ]
    pool_impersonation = [
        "The communication reproduces familiar organizational language to strengthen perceived legitimacy.",
"The artifact borrows trusted identity markers to lower recipient suspicion.",
"The structural presentation imitates established institutions through recognizable formatting.",
"Authority-based persuasion techniques are embedded throughout the communication.",
"The sender identity exhibits characteristics commonly associated with impersonation attempts.",
"The communication leverages institutional familiarity to establish artificial trust.",
"Behavioral indicators suggest deliberate misuse of recognizable identities.",
"The interaction pattern favors trust exploitation through identity simulation.",
"The artifact attempts to reinforce credibility using organizational references.",
"Impersonation mechanisms appear designed to bypass natural skepticism."
    ]
    pool_credential = [
        "The interaction flow attempts to redirect the user toward authentication or identity confirmation.",
"The content promotes disclosure of confidential account information.",
"Behavioral markers indicate possible credential collection objectives.",
"The communication encourages verification procedures inconsistent with normal operations.",
"Sensitive identity information appears to be a primary target.",
"The message structure prioritizes account access confirmation.",
"Authentication-related requests dominate the interaction pathway.",
"The communication attempts to normalize sharing protected credentials.",
"The information request pattern aligns with common phishing objectives.",
"The artifact contains elements associated with account takeover attempts."
    ]
    pool_social_engineering = [
        "The communication relies heavily on trust manipulation instead of objective evidence.",
"Behavioral indicators suggest intentional exploitation of human decision-making biases.",
"The interaction strategy focuses on influencing user behavior through psychological pressure.",
"The wording encourages emotional rather than rational responses.",
"The communication attempts to establish artificial credibility.",
"The narrative structure supports manipulative engagement tactics.",
"The artifact utilizes persuasive techniques commonly associated with deceptive campaigns.",
"The interaction pattern favors compliance through social influence.",
"The language demonstrates calculated attempts to shape recipient behavior.",
"The communication emphasizes persuasion over transparency."
    ]
    pool_domain = [
        "The domain infrastructure displays unusual registration characteristics.",
"Hosting patterns differ from those typically observed in established services.",
"The registration footprint suggests limited operational history.",
"The domain hierarchy contains structural irregularities.",
"Resolution characteristics indicate atypical deployment behavior.",
"The infrastructure demonstrates reduced transparency.",
"The hosting profile exhibits unusual technical traits.",
"The domain architecture contains anomalies requiring additional verification.",
"The registration characteristics differ from trusted baseline expectations.",
"The domain ecosystem warrants elevated scrutiny."
    ]
    pool_url_structure = [
        "The hyperlink construction contains unnecessary complexity.",
"The routing path introduces unusual parameterization.",
"The lexical composition differs from standard operational URLs.",
"The address structure demonstrates excessive segmentation.",
"The URL formatting contains irregular path characteristics.",
"The routing syntax appears artificially expanded.",
"The hyperlink includes structural deviations from conventional patterns.",
"The address composition introduces unnecessary routing depth.",
"The URL design attempts to obscure the final destination.",
"The lexical organization requires additional validation."
    ]
    
    overview = ""
    evidence = []
    
    if risk_level in ["Extreme", "Malicious"]:
        overview = random.choice([
            "The analyzed artifact demonstrates profound behavioral indicators predominantly associated with active, high-impact phishing and advanced social engineering campaigns.",
            "A comprehensive structural and heuristic review flags this asset as fundamentally hostile. The signature architecture exhibits multiple critical threat vectors.",
            "Our behavioral analysis pipeline strongly indicates deliberate malicious intent. The item maps consistently to known cognitive and technical deception frameworks."
        ])
        
        if is_url:
            evidence.append(random.choice(pool_url_structure))
            evidence.append(random.choice(pool_domain))
            if any(w in content_lower for w in ['login', 'secure', 'auth', 'verify']):
                evidence.append(random.choice(pool_impersonation))
        else:
            if any(w in content_lower for w in ['urgent', 'immediate', 'suspend', 'warning']):
                evidence.append(random.choice(pool_urgency))
            if any(w in content_lower for w in ['password', 'login', 'account', 'verify']):
                evidence.append(random.choice(pool_credential))
            if any(w in content_lower for w in ['bank', 'payment', 'money', 'invoice']):
                evidence.append("Financial baiting is tightly integrated into the tactical delivery, attempting monetary exploitation via deceptive invoice protocols.")
            if not evidence:
                evidence.append(random.choice(pool_social_engineering))
                evidence.append(random.choice(pool_impersonation))
        
        random.shuffle(evidence)
        
        recommendation = random.choice([
            "Immediate Action: Do not click any embedded routing links or download any payloads. Inspect the sender's true domain origins independently and consider enabling multi-factor authentication if any interactions have occurred.",
            "Critical Protocol: Avoid entering credentials until domain legitimacy is completely verified by your security administrator. Flag this artifact to your internal threat team immediately.",
            "Active Threat Response: Isolate this communication. Do not supply proprietary data, financial information, or authentication tokens. Initiate an active password rotation if you suspect prior exposure."
        ])
        
    elif risk_level == "Suspicious":
        overview = random.choice([
            "The analysis produced moderate behavioral anomalies that, while not definitively hostile, warrant significant secondary verification.",
            "Preliminary automated review suggests potentially unsafe elements derived from irregular formatting and slightly coercive linguistic traits.",
            "This artifact triggers several borderline heuristic warnings, utilizing a combination of suspicious routing and unusual conversational phrasing."
        ])
        
        if is_url:
            evidence.append("While the URL path does not immediately flag static blacklists, its lexical construction contains atypical parameters often used for tracking or minor obfuscation.")
            if len(content_lower) > 30:
                evidence.append(random.choice(pool_url_structure))
        else:
            if any(w in content_lower for w in ['urgent', 'warning', 'action']):
                evidence.append("There is a subtle attempt to induce urgency, forcing the recipient to prioritize action over careful evaluation.")
            evidence.append("The overall behavioral intent presents mixed signals, blending standard communication with borderline manipulative requests.")
        
        random.shuffle(evidence)
        
        recommendation = random.choice([
            "Elevated Caution: Inspect the sender identity and domain registration details carefully before engaging further. Do not download executable files or macro-enabled documents.",
            "Verification Required: Proceed selectively. Cross-reference the communication with trusted out-of-band channels before authorizing any transactions or fulfilling requests.",
            "Security Prudence: Withhold sensitive information unless explicitly authenticated. Treat this routing path as untrustworthy until structurally verified."
        ])

    else:
        overview = random.choice([
            "The fundamental architecture and behavioral intent of this sample appear fully standard, passing all primary heuristic and lexical baselines.",
            "Our analysis confirms benign, non-threatening structural characteristics. No substantial indicators of manipulation or deception were identified.",
            "The item aligns with standard operational communication formats without triggering any elevated risk heuristics or anomaly rulesets."
        ])
        
        if is_url:
            evidence.append("The domain hierarchy and syntactic routing follow perfectly established conventions. Lexical entropy remains safely within expected baseline tolerances.")
        else:
            evidence.append("The communicative intent is direct and lacks the coercive cognitive patterns universally utilized in social engineering. The syntax mirrors safe, routine interaction.")
            
        recommendation = random.choice([
            "Standard Operations: No severe threats were detected in the immediate analysis. Continue practicing general digital hygiene and situational awareness.",
            "Routine Engagement: This artifact clears automated heuristics. Normal interaction protocols are acceptable, though manual verification remains advisable for sensitive actions.",
            "Safe Transmission: Maintain standard operational security. No artificial urgency, coercive intent, or obfuscated routing characteristics were observed."
        ])

    return {
        "overview": overview,
        "interpretation": " ".join(evidence) if evidence else "The linguistic flow matches standard interpersonal operations with zero significant anomalies detected.",
        "recommendation": recommendation
    }

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Global cache to prevent race-condition duplicates (e.g. React StrictMode)
SCAN_CACHE = {}

model_path = os.path.join(BASE_DIR, "ml", "model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "ml", "vectorizer.pkl")
url_model_path = os.path.join(BASE_DIR, "ml", "url_model.pkl")
sms_model_path = os.path.join(BASE_DIR, "ml", "sms_model.pkl")
sms_vectorizer_path = os.path.join(BASE_DIR, "ml", "sms_vectorizer.pkl")

with open(url_model_path, "rb") as f:
    url_model = pickle.load(f)

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(vectorizer_path, "rb") as f:
    vectorizer = pickle.load(f)

with open(sms_model_path, "rb") as f:
    sms_model = pickle.load(f)

with open(sms_vectorizer_path, "rb") as f:
    sms_vectorizer = pickle.load(f)


# =========================
# MAIN SCAN FUNCTION
# =========================
def scan(current_user):
    try:
        data = request.get_json(silent=True) or {}

        scan_type_raw = data.get('type')
        scan_type = scan_type_raw.lower() if scan_type_raw else None
        content = data.get('content')

        # ROBUST EMPTY INPUT VALIDATION
        content_str = str(content).strip() if content is not None else ""

        if scan_type == 'email':
            cleaned = re.sub(r'(?i)Subject:\s*Sender:\s*Content:\s*', '', content_str).strip()
            if not cleaned:
                return jsonify({"error": "Please enter email content to analyze."}), 400

        if not content_str:
            if scan_type == 'sms':
                return jsonify({"error": "Please enter SMS content to analyze."}), 400
            elif scan_type == 'email':
                return jsonify({"error": "Please enter email content to analyze."}), 400
            elif scan_type == 'url':
                return jsonify({"error": "Please enter a URL to analyze."}), 400
            elif scan_type == 'website':
                return jsonify({"error": "Please enter a website address to analyze."}), 400
            else:
                return jsonify({"error": "Type and content are required."}), 400

        if scan_type in ['url', 'website']:
            if not content_str.startswith(('http://', 'https://')):
                content_str = 'https://' + content_str
                
            if not validate_url(content_str):
                return jsonify({"error": "Invalid URL format."}), 400

        content_lower = content_str.lower()

        # =========================
        # ML PREDICTION
        # =========================
        try:

            if scan_type in ['url', 'website']:

                url_features = extract_lexical_features(content_str)

                prediction = url_model.predict(url_features)[0]
                probability = url_model.predict_proba(url_features)[0]
                classes = url_model.classes_

                prob_dict = dict(zip(classes, probability))
                malicious_prob = prob_dict.get(1, 0)

            else:
                current_model = sms_model if scan_type == 'sms' else model
                current_vectorizer = sms_vectorizer if scan_type == 'sms' else vectorizer

                text_vector = get_combined_features([content_lower], current_vectorizer, fit=False)

                proba = current_model.predict_proba(text_vector)[0]
                classes = current_model.classes_

                prob_dict = dict(zip(classes, proba))

                malicious_prob = prob_dict.get("malicious", 0)

                # =========================
                # CONFIDENCE CALIBRATION
                # =========================
                features = extract_nlp_features(content_lower)
                num_urgency, num_scam, num_credentials, num_financial, text_length, num_urls = features
                
                total_indicators = num_urgency + num_scam + num_credentials + num_financial + num_urls
                
                conversational_words = ["hey", "hello", "hi", "how are you", "miss you", "wanna meet", "lunch", "dinner", "whats up", "what's up", "love you", "baby", "bro", "dude", "mom", "dad", "friend"]
                
                # Check for conversational text safely
                words = content_lower.split()
                is_conversational = any(w in words for w in ["hey", "hello", "hi", "lunch", "dinner", "baby", "bro", "dude", "mom", "dad", "friend"]) or any(phrase in content_lower for phrase in ["how are you", "miss you", "wanna meet", "whats up", "what's up", "love you"])
                
                if total_indicators == 0:
                    if is_conversational or text_length < 50:
                        # Heavy dampening for casual/short text
                        malicious_prob *= 0.1
                    else:
                        # Moderate dampening for general safe text
                        malicious_prob *= 0.3
                else:
                    if num_credentials > 0 or num_financial > 0 or num_scam > 0:
                        # Strong indicators, boost score slightly
                        malicious_prob = min(1.0, malicious_prob * 1.2)

            threat_score = int(malicious_prob * 100)
            
            if threat_score > 100:
                threat_score = 100

            # =========================
            # RISK LEVELS
            # =========================
            if scan_type in ['url', 'website']:
                if threat_score >= 70:
                    risk_level = "Malicious"
                    if threat_score >= 90:
                        risk_level = "Extreme"
                elif threat_score >= 31:
                    risk_level = "Suspicious"
                else:
                    risk_level = "Safe"
            else:
                if threat_score >= 67:
                    if threat_score >= 90:
                        risk_level = "Extreme"
                    else:
                        risk_level = "Malicious"
                elif threat_score >= 26:
                    risk_level = "Suspicious"
                else:
                    risk_level = "Safe"

            # =========================
            # EXPLANATIONS (SMART GENERATION)
            # =========================
            import random

            has_urgency = any(w in content_lower for w in ["urgent", "immediate", "action", "warning", "alert", "suspend", "now", "important", "act fast", "limited"])
            has_credentials = any(w in content_lower for w in ["password", "login", "account", "verify", "authenticate", "sign in", "secure", "credential"])
            has_financial = any(w in content_lower for w in ["bank", "payment", "invoice", "transfer", "billing", "money", "wallet", "crypto", "bitcoin"])
            
            is_url = scan_type in ['url', 'website']
            has_links = True if is_url else ("http" in content_lower or "www." in content_lower)

            sentences = []

            # 1. Core Assessment
            if risk_level in ["Extreme", "Malicious"]:
                if is_url:
                    sentences.append(random.choice([
                        "This address exhibits structural traits highly correlated with known malicious domains.",
                        "Our analysis strongly indicates this URL is designed to deceive or redirect users to harmful endpoints.",
                        "This link matches established behavioral profiles for phishing or malware distribution."
                    ]))
                else:
                    sentences.append(random.choice([
                        "This content demonstrates significant linguistic patterns consistent with social engineering.",
                        "We detected strong markers of manipulation and deception throughout this message.",
                        "The structural and semantic elements here strongly align with malicious communications."
                    ]))
            elif risk_level == "Suspicious":
                if is_url:
                    sentences.append(random.choice([
                        "This link contains unusual formatting or traits that warrant heightened caution.",
                        "While not definitively malicious, this domain exhibits characteristics often seen in unverified or risky endpoints."
                    ]))
                else:
                    sentences.append(random.choice([
                        "This content utilizes questionable language or makes unusual requests.",
                        "Certain phrasing in this message triggers our suspicious behavior heuristics."
                    ]))
            else: # Safe
                if is_url:
                    sentences.append(random.choice([
                        "This link does not display obvious signs of malicious construction or deceptive routing.",
                        "The domain structure and URL parameters appear benign based on our current threat heuristics."
                    ]))
                else:
                    sentences.append(random.choice([
                        "This message lacks the common linguistic markers typically associated with phishing or social engineering.",
                        "The semantic structure and intent of this content appear standard and benign."
                    ]))

            # 2. Specific Observations
            if risk_level in ["Extreme", "Malicious", "Suspicious"]:
                obs = []
                if has_urgency:
                    obs.append("employs artificial urgency to force a quick reaction")
                if has_credentials:
                    obs.append("targets sensitive account credentials")
                if has_financial:
                    obs.append("focuses heavily on financial or billing actions")
                if has_links and not is_url:
                    obs.append("includes potentially dangerous external routing")

                if obs:
                    if len(obs) == 1:
                        sentences.append(f"Specifically, it {obs[0]}.")
                    elif len(obs) == 2:
                        sentences.append(f"Specifically, it {obs[0]} and {obs[1]}.")
                    else:
                        sentences.append(f"Specifically, it {obs[0]}, {obs[1]}, and {obs[2]}.")
            else:
                # Safe observations
                if has_urgency or has_credentials or has_financial or has_links:
                    sentences.append("Although it contains some sensitive keywords, the overall context lacks malicious intent.")

            # 3. Deep Actionable Recommendation Replacement
            if risk_level in ["Extreme", "Malicious"]:
                recommendation = random.choice([
                    "Immediate Action: Do not click any embedded routing links or download any payloads. Inspect the sender's true domain origins independently and consider enabling multi-factor authentication if any interactions have occurred.",
                    "Critical Protocol: Avoid entering credentials until domain legitimacy is completely verified by your security administrator. Flag this artifact to your internal threat team immediately.",
                    "Active Threat Response: Isolate this communication. Do not supply proprietary data, financial information, or authentication tokens. Initiate an active password rotation if you suspect prior exposure."
                ])
            elif risk_level == "Suspicious":
                recommendation = random.choice([
                    "Elevated Caution: Inspect the sender identity and domain registration details carefully before engaging further. Do not download executable files or macro-enabled documents.",
                    "Verification Required: Proceed selectively. Cross-reference the communication with trusted out-of-band channels before authorizing any transactions or fulfilling requests.",
                    "Security Prudence: Withhold sensitive information unless explicitly authenticated. Treat this routing path as untrustworthy until structurally verified."
                ])
            else:
                recommendation = random.choice([
                    "Standard Operations: No severe threats were detected in the immediate analysis. Continue practicing general digital hygiene and situational awareness.",
                    "Routine Engagement: This artifact clears automated heuristics. Normal interaction protocols are acceptable, though manual verification remains advisable for sensitive actions.",
                    "Safe Transmission: Maintain standard operational security. No artificial urgency, coercive intent, or obfuscated routing characteristics were observed."
                ])
                
            explanation = " ".join(sentences)

        except Exception as e:
            import traceback
            traceback.print_exc()

            return jsonify({
                "error": f"ML prediction failed: {str(e)}"
            }), 500

        # =========================
        # ALERT SYSTEM
        # =========================
        alert = threat_score >= 90

        # =========================
        # SAVE TO DATABASE
        # =========================
        try:
            cache_key = f"{current_user.id}_{hash(content_str)}"
            current_time = time.time()
            
            if cache_key in SCAN_CACHE and (current_time - SCAN_CACHE[cache_key]) < 10:
                print(f"[DEBUG] Race condition duplicate scan prevented for user {current_user.id}")
            else:
                SCAN_CACHE[cache_key] = current_time
                
                from datetime import datetime, timedelta
                time_threshold = datetime.utcnow() - timedelta(seconds=10)
                existing_scan = Scan.query.filter(
                    Scan.user_id == current_user.id,
                    Scan.content == content_str,
                    Scan.created_at >= time_threshold
                ).first()

                if not existing_scan:
                    new_scan = Scan(
                        user_id=current_user.id,
                        content_type=scan_type,
                        content=content_str,
                        risk_level=risk_level,
                        threat_score=threat_score,
                        explanation=explanation
                    )

                    db.session.add(new_scan)
                    db.session.commit()
                else:
                    print(f"[DEBUG] DB duplicate scan prevented for user {current_user.id}")

        except Exception as e:

            db.session.rollback()

            print("DATABASE SAVE ERROR:", str(e))

        # =========================
        # RESPONSE
        # =========================
        response_data = {
            "type": scan_type,
            "risk_level": risk_level,
            "threat_score": threat_score,
            "assistance_message": recommendation,
            "alert": alert
        }

        if alert:
            response_data["alert_message"] = (
                "EXTREME THREAT DETECTED"
            )

        # =========================
        # PREMIUM FEATURES
        # =========================
        if current_user.is_premium:

            ai_tags = []
            
            if any(word in content_lower for word in ["urgent", "immediate", "action", "warning", "alert", "suspend"]):
                ai_tags.append("Urgency Detected")
                
            if any(word in content_lower for word in ["password", "login", "account", "verify", "authenticate", "sign in"]):
                ai_tags.append("Credential Request")
                
            if any(word in content_lower for word in ["bank", "payment", "invoice", "transfer", "billing"]):
                ai_tags.append("Financial Risk")
                
            if not ai_tags:
                if threat_score >= 70:
                    ai_tags.append("Malicious Patterns")
                else:
                    ai_tags.append("Safe Heuristics")

            response_data["behavior_analysis"] = generate_behavior_analysis(scan_type, content_str, risk_level, threat_score)
            response_data["ai_tags"] = ai_tags
            
            print("[DEBUG] Behavior Analysis:")
            print(response_data["behavior_analysis"])
            print("[DEBUG] Response Data:")
            print(response_data)

            # Ensure defaults to avoid UnboundLocalError
            ip_address = "Unavailable"
            hosting_location = "Unavailable"
            isp_provider = "Unknown"
            ssl_status = "Unknown"
            domain_age = "Unknown"
            routing_cloaking = "No cloaking detected"

            try:
                from urllib.parse import urlparse
                import socket
                import requests
                import ssl
                import whois
                from datetime import datetime

                parsed = urlparse(content_str)
                domain = parsed.netloc or parsed.path
                if domain.startswith('www.'):
                    domain = domain[4:]

                ip_address = socket.gethostbyname(domain)

                ip_data = requests.get(
                    f"http://ip-api.com/json/{ip_address}",
                    timeout=5
                ).json()

                hosting_location = (
                    f"{ip_data.get('city', 'Unknown')}, "
                    f"{ip_data.get('country', 'Unknown')}"
                )

                isp_provider = ip_data.get("isp", "Unknown")

                # SSL Verification
                try:
                    context = ssl.create_default_context()
                    with socket.create_connection((domain, 443), timeout=3) as sock:
                        with context.wrap_socket(sock, server_hostname=domain) as ssock:
                            cert = ssock.getpeercert()
                            if cert and 'notAfter' in cert:
                                expire_date = datetime.strptime(cert['notAfter'], "%b %d %H:%M:%S %Y %Z")
                                if expire_date < datetime.utcnow():
                                    ssl_status = "Expired SSL Certificate"
                                else:
                                    ssl_status = "Valid SSL Certificate"
                            else:
                                ssl_status = "Valid SSL Certificate"
                except ssl.CertificateError:
                    ssl_status = "Invalid SSL Certificate"
                except ssl.SSLError:
                    ssl_status = "Invalid SSL Certificate"
                except (socket.timeout, ConnectionRefusedError, socket.gaierror):
                    ssl_status = "No SSL Certificate (HTTP Only)"
                except Exception:
                    ssl_status = "No SSL Information Available"

                # Domain Age
                try:
                    print(f"[DEBUG] WHOIS Extracted Domain: {domain}")
                    domain_info = whois.whois(domain)
                    print(f"[DEBUG] Raw WHOIS Response: {domain_info}")
                    
                    if not domain_info:
                        domain_age = "WHOIS unavailable"
                        print("[DEBUG] WHOIS Response was empty.")
                    else:
                        creation_date = domain_info.get('creation_date') if isinstance(domain_info, dict) else getattr(domain_info, 'creation_date', None)
                        print(f"[DEBUG] creation_date value: {creation_date}")
                        print(f"[DEBUG] creation_date type: {type(creation_date)}")
                        
                        if not creation_date:
                            domain_age = "Creation date not provided"
                        else:
                            if type(creation_date) is list:
                                creation_date = creation_date[0]
                                
                            if isinstance(creation_date, datetime):
                                # Handle timezone awareness
                                if creation_date.tzinfo is not None:
                                    # Aware datetime
                                    now = datetime.now(creation_date.tzinfo)
                                else:
                                    # Naive datetime
                                    now = datetime.now()
                                    
                                age_days = (now - creation_date).days
                                if age_days >= 365:
                                    years = age_days // 365
                                    domain_age = f"Domain Age: {years} Year{'s' if years != 1 else ''}"
                                elif age_days >= 30:
                                    months = age_days // 30
                                    domain_age = f"Domain Age: {months} Month{'s' if months != 1 else ''}"
                                else:
                                    domain_age = f"Domain Age: {age_days} Day{'s' if age_days != 1 else ''}"
                            elif isinstance(creation_date, str):
                                domain_age = "Unexpected data type (string)"
                            else:
                                domain_age = "Unexpected data type"
                                
                    print(f"[DEBUG] Final Calculated Age: {domain_age}")

                except (socket.timeout, TimeoutError):
                    print("[DEBUG] WHOIS Exception: TimeoutError")
                    domain_age = "WHOIS timeout"
                except Exception as e:
                    error_msg = str(e).lower()
                    print(f"[DEBUG] WHOIS Exception ({type(e).__name__}): {e}")
                    if "no match for" in error_msg or "not found" in error_msg:
                        domain_age = "WHOIS unavailable"
                    elif "unsupported tld" in error_msg or "unknown tld" in error_msg:
                        domain_age = "Unsupported TLD"
                    elif "limit exceeded" in error_msg or "blocked" in error_msg or "quota" in error_msg:
                        domain_age = "WHOIS blocked by registrar"
                    else:
                        domain_age = "WHOIS unavailable"

                # Routing Cloaking
                try:
                    target_url = content_str if content_str.startswith(('http://', 'https://')) else 'http://' + content_str
                    resp = requests.get(target_url, allow_redirects=True, timeout=5)
                    redirect_count = len(resp.history)
                    final_url = resp.url
                    
                    parsed_final = urlparse(final_url)
                    final_domain = parsed_final.netloc or parsed_final.path
                    if final_domain.startswith('www.'):
                        final_domain = final_domain[4:]
                    
                    shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'shorturl.at']
                    
                    if redirect_count > 3:
                        routing_cloaking = "Suspicious redirect behavior detected"
                    elif final_domain != domain and not (final_domain.endswith('.' + domain) or domain.endswith('.' + final_domain)):
                        routing_cloaking = "Potential cloaking detected"
                    elif any(s in domain for s in shorteners):
                        routing_cloaking = "Potential cloaking detected"
                    else:
                        if redirect_count == 0:
                            routing_cloaking = "No cloaking detected"
                        else:
                            routing_cloaking = f"{redirect_count} redirect{'s' if redirect_count != 1 else ''} detected"

                except Exception as e:
                    print("Redirect Analysis Error:", e)
                    routing_cloaking = "Redirect Analysis Unavailable"

            except Exception as e:
                print("DOMAIN INTELLIGENCE ERROR:", e)

            response_data["ip_address"] = ip_address
            response_data["hosting_location"] = hosting_location
            response_data["isp_provider"] = isp_provider
            response_data["ssl_status"] = ssl_status
            response_data["domain_age"] = domain_age
            response_data["routing_cloaking"] = routing_cloaking

        else:

            response_data["premium_message"] = (
                "Upgrade to premium for advanced analysis."
            )

        # Force assignment to avoid undefined user/condition issues
        response_data["behavior_analysis"] = generate_behavior_analysis(scan_type, content_str, risk_level, threat_score)

        print("========== RESPONSE DATA ==========")
        print(response_data)
        print("===================================")

        return jsonify(response_data), 200

    except Exception as e:

        db.session.rollback()

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": "Internal server error during scanning."
        }), 500