import re

def validate_email(email):
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def validate_password_strength(password):
    # Enforce basic password rules (min 6 chars)
    if not password or len(password) < 6:
        return False
    return True

from urllib.parse import urlparse

def validate_url(url):
    try:
        if not url or not isinstance(url, str):
            return False
            
        url = url.strip()
        if not url.startswith(('http://', 'https://')):
             url = 'https://' + url
             
        parsed = urlparse(url)
        
        # Valid URLs must have a network location (domain or IP)
        if not parsed.netloc:
            return False
            
        # Check if the domain has at least one dot (e.g., google.com, 192.168.1.1)
        # or if it's localhost
        if '.' not in parsed.netloc and parsed.netloc != 'localhost':
            return False
            
        # Basic check to reject spaces or obvious invalid chars in the domain
        if re.search(r'[^\w\.:\-]', parsed.netloc):
             return False

        return True
    except Exception:
        return False
