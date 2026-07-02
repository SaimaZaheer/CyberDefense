import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from lexical_features import extract_features_dict
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'url_dataset.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'url_model.pkl')

print("Loading URL dataset...")
df = pd.read_csv(DATASET_PATH)

# Drop rows with missing values
df = df.dropna(subset=['url', 'result'])

count_0 = len(df[df['result'] == 0])
count_1 = len(df[df['result'] == 1])
print(f"Total Dataset - Benign: {count_0}, Malicious: {count_1}")

# Balance the dataset based on minimum class size, capping it at a reasonable number for quick but reliable training (e.g. 100,000 max each)
n_samples = min(count_0, count_1, 100000)

print(f"Sampling {n_samples} items from each class to balance...")
df_0 = df[df['result'] == 0].sample(n=n_samples, random_state=42)
df_1 = df[df['result'] == 1].sample(n=n_samples, random_state=42)

df_balanced = pd.concat([df_0, df_1])

print(f"Extracting lexical features for {len(df_balanced)} URLs...")
features_list = [extract_features_dict(u) for u in df_balanced['url']]
X = pd.DataFrame(features_list)
y = df_balanced['result'].values

print("Training RandomForest model...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a fast and robust Random Forest classifier
model = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Model testing accuracy: {score:.4f}")

with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model, f)
print(f"Model successfully saved to {MODEL_PATH}")
