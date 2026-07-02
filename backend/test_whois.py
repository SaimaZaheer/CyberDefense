import whois
from datetime import datetime

domains_to_test = [
    "google.com",
    "github.com",
    "microsoft.com",
    "cloudflare.com",
    "neverssl.com"
]

def test_domain(domain):
    print(f"\n--- Testing Domain: {domain} ---")
    try:
        domain_info = whois.whois(domain)
        print(f"Raw WHOIS Response Keys: {list(domain_info.keys()) if domain_info else 'None'}")
        
        creation_date = domain_info.creation_date
        print(f"Creation Date Value: {creation_date}")
        print(f"Creation Date Type: {type(creation_date)}")
        
        if not creation_date:
            print("Failure: Creation date not provided")
            return
            
        if type(creation_date) is list:
            print("Handling list type for creation_date")
            creation_date = creation_date[0]
            
        # Timezone handling
        if isinstance(creation_date, datetime):
            if creation_date.tzinfo is not None:
                # timezone aware
                print("Timezone aware datetime detected")
                age_days = (datetime.now(creation_date.tzinfo) - creation_date).days
            else:
                # naive
                print("Naive datetime detected")
                age_days = (datetime.now() - creation_date).days
                
            if age_days >= 365:
                years = age_days // 365
                domain_age = f"Domain Age: {years} Year{'s' if years != 1 else ''}"
            elif age_days >= 30:
                months = age_days // 30
                domain_age = f"Domain Age: {months} Month{'s' if months != 1 else ''}"
            else:
                domain_age = f"Domain Age: {age_days} Day{'s' if age_days != 1 else ''}"
                
            print(f"Calculated Age: {domain_age}")
        elif isinstance(creation_date, str):
            print(f"Creation date is a string: {creation_date}")
        else:
            print(f"Unexpected data type: {type(creation_date)}")
            
    except Exception as e:
        print(f"WHOIS Exception: {type(e).__name__} - {e}")

for d in domains_to_test:
    test_domain(d)
