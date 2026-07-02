import pandas as pd
import re
import math
from urllib.parse import urlparse

# Common URL shorteners
SHORTENERS = {'bit.ly', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'tinyurl.com', 'tiny.cc', 'mcaf.ee', 'cli.gs', 'yfrog.com', 'twit.ac'}
# Common suspicious/cheap TLDs
SUSPICIOUS_TLDS = {'.zip', '.xyz', '.top', '.click', '.gq', '.ml', '.cf', '.tk', '.biz', '.info', '.cc', '.wang'}

def calculate_entropy(text):
    if not text:
        return 0
    entropy = 0
    for x in set(text):
        p_x = float(text.count(x)) / len(text)
        entropy += - p_x * math.log(p_x, 2)
    return entropy

def extract_features_dict(url):
    # Ensure it's a string
    url = str(url).lower()
    
    url = url.replace('https://www.', 'https://')
    url = url.replace('http://www.', 'http://')
    if url.startswith('www.'):
        url = url[4:]
    
    # Prepend http:// if there's no scheme just to parse properly
    if not url.startswith('http://') and not url.startswith('https://'):
        parsed_url = urlparse('http://' + url)
    else:
        parsed_url = urlparse(url)

    hostname = parsed_url.hostname or ''
    path = parsed_url.path or ''
    query = parsed_url.query or ''

    # Basic lengths
    url_length = len(url)
    hostname_length = len(hostname)
    path_length = len(path)
    query_length = len(query)

    # Counts
    num_dots = url.count('.')
    num_hyphens = url.count('-')
    num_digits = sum(c.isdigit() for c in url)
    
    special_chars = set('!@#$%^&*()_+=[]{}|;:\'",<>?/~`')
    num_special_chars = sum(1 for c in url if c in special_chars)
    
    # Subdomains (split hostname by ., minus the TLD and SLD)
    parts = hostname.split('.')
    subdomain_count = max(0, len(parts) - 2) if len(parts) > 1 else 0

    has_https = 1 if url.startswith('https://') else 0

    # IP address logic
    has_ip_address = 1 if re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname) else 0

    entropy = calculate_entropy(url)

    # Shortener
    has_shortener = 1 if hostname.lower() in SHORTENERS else 0

    # Suspicious TLD
    has_suspicious_tld = 0
    tld = '.' + parts[-1].lower() if parts else ''
    if any(tld == s_tld for s_tld in SUSPICIOUS_TLDS):
        has_suspicious_tld = 1

    # Ratio
    num_letters = sum(c.isalpha() for c in url)
    digit_letter_ratio = num_digits / num_letters if num_letters > 0 else 0

    feature_dict = {
        'url_length': url_length,
        'hostname_length': hostname_length,
        'path_length': path_length,
        'query_length': query_length,
        'num_dots': num_dots,
        'num_hyphens': num_hyphens,
        'num_digits': num_digits,
        'num_special_chars': num_special_chars,
        'subdomain_count': subdomain_count,
        'has_https': has_https,
        'has_ip_address': has_ip_address,
        'entropy': entropy,
        'has_shortener': has_shortener,
        'suspicious_tld': has_suspicious_tld,
        'digit_letter_ratio': digit_letter_ratio
    }
    
    return feature_dict

def extract_lexical_features(url):
    return pd.DataFrame([extract_features_dict(url)])
