import re
import string
from scipy.sparse import hstack, csr_matrix

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub(f"[{re.escape(string.punctuation)}]", " ", text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_nlp_features(text):
    text = str(text).lower()
    
    urgency_words = ['urgent', 'immediately', 'action required', 'suspend', 'restricted', 'alert', 'important', 'warning', 'attention']
    scam_words = ['winner', 'lottery', 'claim', 'prize', 'cash', 'guarantee', 'free', 'reward', 'bonus', 'gift']
    credential_words = ['password', 'login', 'verify', 'account', 'update', 'confirm', 'security', 'sign in', 'authenticate']
    financial_words = ['bank', 'payment', 'invoice', 'transfer', 'billing', 'credit card', 'debit', 'transaction']
    
    num_urgency = sum(1 for w in urgency_words if w in text)
    num_scam = sum(1 for w in scam_words if w in text)
    num_credentials = sum(1 for w in credential_words if w in text)
    num_financial = sum(1 for w in financial_words if w in text)
    text_length = len(text)
    num_urls = text.count('http') + text.count('www.')
    
    return [num_urgency, num_scam, num_credentials, num_financial, text_length, num_urls]

def get_combined_features(texts, vectorizer, fit=False):
    clean_texts = [preprocess_text(t) for t in texts]
    
    if fit:
        tfidf_features = vectorizer.fit_transform(clean_texts)
    else:
        tfidf_features = vectorizer.transform(clean_texts)
        
    nlp_features_list = [extract_nlp_features(t) for t in texts]
    nlp_sparse = csr_matrix(nlp_features_list)
    
    combined = hstack([tfidf_features, nlp_sparse])
    return combined
