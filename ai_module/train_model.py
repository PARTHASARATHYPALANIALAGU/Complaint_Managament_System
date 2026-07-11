"""
ML Training Script: TF-IDF + Logistic Regression
Run this from the ai_module/ directory:
    python train_model.py
Outputs:
    models/vectorizer.pkl
    models/classifier.pkl
"""
import os
import pandas as pd
import numpy as np
import pickle
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset", "complaints_dataset.csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)


# ─── Text Preprocessing ──────────────────────────────────────────────────────
def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ─── Load & Preprocess Data ──────────────────────────────────────────────────
df = pd.read_csv(DATASET_PATH)
print(f"✅ Loaded {len(df)} samples")
print(f"   Categories: {df['category'].unique().tolist()}")
print(f"   Distribution:\n{df['category'].value_counts()}\n")

df["clean_text"] = df["text"].apply(preprocess)

X = df["clean_text"]
y = df["category"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ─── TF-IDF Vectorizer ───────────────────────────────────────────────────────
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=5000,
    sublinear_tf=True,
    min_df=2,
)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ─── Logistic Regression ─────────────────────────────────────────────────────
clf = LogisticRegression(
    C=5.0,
    max_iter=1000,
    class_weight="balanced",
    solver="lbfgs",
    multi_class="multinomial",
)
clf.fit(X_train_vec, y_train)
y_pred = clf.predict(X_test_vec)

# ─── Evaluation Metrics ──────────────────────────────────────────────────────
acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)

print("=" * 55)
print(f"  Accuracy  : {acc:.4f}")
print(f"  Precision : {prec:.4f}")
print(f"  Recall    : {rec:.4f}")
print(f"  F1-Score  : {f1:.4f}")
print("=" * 55)
print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

# ─── Confusion Matrix Plot ───────────────────────────────────────────────────
labels = sorted(y.unique())
cm = confusion_matrix(y_test, y_pred, labels=labels)
plt.figure(figsize=(12, 9))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
plt.title("Confusion Matrix – Complaint Classifier")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
cm_path = os.path.join(MODELS_DIR, "confusion_matrix.png")
plt.savefig(cm_path)
print(f"\n📈 Confusion matrix saved → {cm_path}")

# ─── Save Artifacts ──────────────────────────────────────────────────────────
vec_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
clf_path = os.path.join(MODELS_DIR, "classifier.pkl")

with open(vec_path, "wb") as f:
    pickle.dump(vectorizer, f)
with open(clf_path, "wb") as f:
    pickle.dump(clf, f)

print(f"\n✅ Model saved  → {clf_path}")
print(f"✅ Vectorizer   → {vec_path}")
print("\nTraining complete! 🎉")
