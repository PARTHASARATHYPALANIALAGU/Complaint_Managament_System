"""
Hybrid Analyzer – Combines ML + LLM with graceful fallback.
Priority:
  1. LLM analysis (full: category, confidence, sentiment, priority, summary, suggestion, recommendation)
  2. If LLM fails → ML for category/confidence, then basic heuristics for the rest
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from ml_predictor import predict as ml_predict
from llm_analyzer import analyze as llm_analyze
from typing import Dict

PRIORITY_KEYWORDS = {
    "High": [
        "urgent", "immediate", "dangerous", "emergency", "harassment",
        "ragging", "theft", "fire", "broken", "sick", "injury", "accident",
        "molest", "attack", "poisoning", "expired", "flood", "electric",
    ],
    "Medium": [
        "not working", "broken", "leak", "late", "slow", "incomplete",
        "missing", "delay", "please fix", "issue", "problem", "fault",
    ],
}

SENTIMENT_KEYWORDS = {
    "Positive": [
        "great", "excellent", "happy", "love", "amazing", "appreciated",
        "helpful", "impressed", "good", "improved", "thank", "best",
        "wonderful", "superfast", "convenient", "efficient",
    ],
    "Negative": [
        "poor", "bad", "terrible", "horrible", "disgusting", "unhygienic",
        "rude", "broken", "issue", "problem", "not working", "never",
        "worst", "unacceptable", "sick", "fail", "complaint", "annoying",
    ],
}


def _heuristic_sentiment(text: str) -> str:
    t = text.lower()
    pos = sum(1 for kw in SENTIMENT_KEYWORDS["Positive"] if kw in t)
    neg = sum(1 for kw in SENTIMENT_KEYWORDS["Negative"] if kw in t)
    if pos > neg:
        return "Positive"
    if neg > pos:
        return "Negative"
    return "Neutral"


def _heuristic_priority(text: str) -> str:
    t = text.lower()
    for p, keywords in PRIORITY_KEYWORDS.items():
        if any(kw in t for kw in keywords):
            return p
    return "Low"


def _category_to_department(category: str) -> str:
    return category  # department name = category name in this system


def analyze(title: str, description: str) -> Dict:
    """
    Main entry point for the hybrid analysis pipeline.
    Returns a dict with all AI prediction fields.
    """
    combined_text = f"{title}. {description}"

    # ── Step 1: Always run ML ──────────────────────────────────────────────
    ml_result = ml_predict(combined_text)

    # ── Step 2: Try LLM ───────────────────────────────────────────────────
    llm_result = llm_analyze(title, description)

    if llm_result:
        # Merge: use LLM for rich analysis, ML confidence score
        return {
            "category": llm_result.get("category") or ml_result["category"],
            "confidence": ml_result["confidence"],  # ML gives reliable confidence
            "sentiment": llm_result.get("sentiment", "Neutral"),
            "priority": llm_result.get("priority", "Low"),
            "summary": llm_result.get("summary", description[:200]),
            "department_suggestion": llm_result.get("department_suggestion")
                or _category_to_department(ml_result["category"]),
            "admin_recommendation": llm_result.get(
                "admin_recommendation", "Please review this complaint."
            ),
            "model_used": "hybrid",
        }

    # ── Step 3: Fallback – ML only + heuristics ───────────────────────────
    return {
        "category": ml_result["category"],
        "confidence": ml_result["confidence"],
        "sentiment": _heuristic_sentiment(combined_text),
        "priority": _heuristic_priority(combined_text),
        "summary": f"{title}. {description[:150]}...",
        "department_suggestion": _category_to_department(ml_result["category"]),
        "admin_recommendation": (
            f"This complaint relates to '{ml_result['category']}'. "
            "Please assign to the relevant department for resolution."
        ),
        "model_used": "ml",
    }
