import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report, precision_score, recall_score, f1_score, confusion_matrix
import pickle
from text_features import get_combined_features

# =========================
# LOAD DATASET
# =========================
df = pd.read_csv("phishing_email.csv")
# Use the requested columns and rename text_combined to text for consistency
df = df[["text_combined", "label"]]
df.columns = ["text", "label"]

# =========================
# CLEAN DATA
# =========================
# Remove missing values
df = df.dropna()

# Convert to string (VERY important)
df["text"] = df["text"].astype(str)

# Map labels to system format (0 -> safe, 1 -> malicious)
df["label"] = df["label"].astype(int).replace({
    0: "safe",
    1: "malicious"
})

# Remove any unexpected labels (safety filter)
df = df[df["label"].isin(["malicious", "safe"])]

# =========================
# SPLIT DATA
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]  # keeps balance
)

# =========================
# VECTORIZATION & FEATURES
# =========================
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_df=0.9,
    min_df=2,
    ngram_range=(1, 2)  # big improvement
)

print("Extracting combined NLP features for training...")
X_train_vec = get_combined_features(X_train.tolist(), vectorizer, fit=True)
print("Extracting combined NLP features for testing...")
X_test_vec = get_combined_features(X_test.tolist(), vectorizer, fit=False)

# =========================
# MODEL TRAINING
# =========================
print("Training and calibrating Logistic Regression model...")
base_model = LogisticRegression(max_iter=1000)
model = CalibratedClassifierCV(base_model, method='sigmoid', cv=5)
model.fit(X_train_vec, y_train)

# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, pos_label='malicious')
recall = recall_score(y_test, y_pred, pos_label='malicious')
f1 = f1_score(y_test, y_pred, pos_label='malicious')
conf_matrix = confusion_matrix(y_test, y_pred, labels=['safe', 'malicious'])

print("Accuracy:", accuracy)
print("Precision:", precision)
print("Recall:", recall)
print("F1-score:", f1)
print("\nConfusion Matrix:")
print(conf_matrix)

print("\nDetailed Report:")
print(classification_report(y_test, y_pred))

# =========================
# SAVE MODEL
# =========================
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("\nModel and vectorizer saved successfully!")