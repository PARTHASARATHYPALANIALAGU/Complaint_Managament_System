"""
ML Inference Wrapper – loads TF-IDF + Logistic Regression from disk.
"""
import os
import re
import pickle
from typing import Dict

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
_vectorizer = None
_classifier = None


def _load_models():
    global _vectorizer, _classifier
    if _vectorizer is None or _classifier is None:
        vec_path = os.path.join(MODELS_DIR, "vectorizer.pkl")
        clf_path = os.path.join(MODELS_DIR, "classifier.pkl")
        if not os.path.exists(vec_path) or not os.path.exists(clf_path):
            raise FileNotFoundError(
                "Model artifacts not found. Run `python train_model.py` first."
            )
        with open(vec_path, "rb") as f:
            _vectorizer = pickle.load(f)
        with open(clf_path, "rb") as f:
            _classifier = pickle.load(f)


def _preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def predict(text: str) -> Dict:
    """
    Returns:
        {
            "category": str,
            "confidence": float,
            "all_scores": dict[str, float]
        }
    """
    _load_models()
    cleaned = _preprocess(text)
    vec = _vectorizer.transform([cleaned])
    proba = _classifier.predict_proba(vec)[0]
    classes = _classifier.classes_
    best_idx = proba.argmax()
    return {
        "category": classes[best_idx],
        "confidence": round(float(proba[best_idx]), 4),
        "all_scores": {c: round(float(p), 4) for c, p in zip(classes, proba)},
    }
