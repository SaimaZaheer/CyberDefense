import socket
import ssl
import whois
import requests
import urllib.parse
import datetime

def get_domain_intelligence(url):
    domain_data = {
        "domain_age": "N/A",
        "ssl_status": "N/A",
        "hosting_location": "N/A",
        "isp_provider": "N/A",
        "ip_address": "N/A",
        "routing_cloaking": "N/A"
    }

    try:
        parsed = urllib.parse.urlparse(url)
        hostname = parsed.netloc if parsed.netloc else parsed.path.split('/')[0]
        hostname = hostname.split(':')[0]
        if hostname.startswith('www.'):
            hostname = hostname[4:]
    except Exception as e:
        print(f"[DOMAIN DEBUG] Hostname extraction failed: {e}")
        return domain_data

    # B) Resolve IP address using socket
    resolved_ip = None
    try:
        resolved_ip = socket.gethostbyname(hostname)
        domain_data["ip_address"] = resolved_ip
    except Exception as e:
        print(f"[DOMAIN DEBUG] IP resolution failed for {hostname}: {e}")

    # C) Detect SSL certificate availability
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                if cert:
                    domain_data["ssl_status"] = "Secured (HTTPS)"
                else:
                    domain_data["ssl_status"] = "Unsecured / Invalid (HTTP)"
    except Exception as e:
        print(f"[DOMAIN DEBUG] SSL detection failed: {e}")
        if url.startswith("https"):
            domain_data["ssl_status"] = "Secured (HTTPS)" # Fallback if standard parsing fails but it's clearly https
        else:
            domain_data["ssl_status"] = "Unsecured / Invalid (HTTP)"

    # D & E) Fetch WHOIS information & Calculate domain age in years
    try:
        w = whois.whois(hostname)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        
        if isinstance(creation_date, datetime.datetime):
            now = datetime.datetime.now(creation_date.tzinfo) if creation_date.tzinfo else datetime.datetime.now()
            age_days = (now - creation_date).days
            age_years = age_days / 365.25
            if age_years < 1:
                domain_data["domain_age"] = f"{int(age_days / 30)} months (Recent)"
            else:
                domain_data["domain_age"] = f"{int(age_years)} years (Established)"
    except Exception as e:
        print(f"[DOMAIN DEBUG] WHOIS failed: {e}")

    # F) Fetch geo/IP provider information using ip-api.com
    domain_data["latitude"] = None
    domain_data["longitude"] = None
    domain_data["timezone"] = "N/A"
    
    if resolved_ip:
        try:
            res = requests.get(f"http://ip-api.com/json/{resolved_ip}", timeout=4)
            if res.status_code == 200:
                geo = res.json()
                if geo.get("status") == "success":
                    city = geo.get("city", "")
                    country = geo.get("country", "")
                    location = f"{city}, {country}".strip(", ")
                    if location:
                        domain_data["hosting_location"] = location
                    if geo.get("isp"):
                        domain_data["isp_provider"] = geo.get("isp")
                    
                    domain_data["latitude"] = geo.get("lat")
                    domain_data["longitude"] = geo.get("lon")
                    domain_data["timezone"] = geo.get("timezone", "N/A")
        except Exception as e:
            print(f"[DOMAIN DEBUG] IP-API failed: {e}")

    # Routing / Cloaking
    try:
        full_url = url if url.startswith("http") else f"http://{hostname}"
        res = requests.get(full_url, timeout=3, allow_redirects=True)
        if len(res.history) > 1:
            domain_data["routing_cloaking"] = f"Detected ({len(res.history)} hops)"
        else:
            domain_data["routing_cloaking"] = "None Detected"
    except Exception as e:
        print(f"[DOMAIN DEBUG] Routing detection failed: {e}")

    print(f"[DOMAIN DEBUG] Result for {url}:", domain_data)
    return domain_data
