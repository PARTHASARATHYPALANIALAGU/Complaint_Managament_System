"""
LLM Analyzer – Uses Google Gemini API (free tier: 15 req/min, no daily cap).
Model: gemini-2.0-flash (ultra-fast, free, generous limits)
Fallback: gemini-1.5-flash
"""
import json
import os
import re
import requests
from typing import Dict, Optional

# Load .env from backend/ so the API key is available when called as subprocess
try:
    from dotenv import load_dotenv
    _env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
    if os.path.exists(_env_path):
        load_dotenv(_env_path, override=True)
    else:
        _env_path2 = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
        load_dotenv(_env_path2, override=True)
except ImportError:
    pass

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

GEMINI_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash",
]

ANALYSIS_PROMPT = """You are an AI assistant for a university campus complaint management system.
Analyze the following campus complaint and return ONLY valid JSON — no markdown, no extra text.

Complaint Title: {title}
Complaint Description: {description}

Return JSON with exactly these keys:
{{
  "sentiment": "Positive" or "Neutral" or "Negative",
  "priority": "Low" or "Medium" or "High",
  "summary": "<2-3 sentence detailed summary of the issue and its impact>",
  "department_suggestion": "<one department from: Hostel, Transport, Academics, Library, Wi-Fi / Internet, Cafeteria, Maintenance, Security, Examination, Administration, Others>",
  "admin_recommendation": "<2-3 sentence specific actionable steps the admin should take to resolve this>",
  "category": "<same list as department_suggestion>"
}}"""


def _clean_json(raw: str) -> str:
    """Strip markdown code fences from LLM output."""
    raw = re.sub(r"```(?:json)?", "", raw, flags=re.IGNORECASE)
    raw = raw.strip().strip("`").strip()
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return match.group(0)
    return raw


def analyze(title: str, description: str) -> Optional[Dict]:
    """
    Calls Google Gemini API and returns structured analysis dict.
    Returns None if all models fail (falls back to ML in hybrid_analyzer).
    """
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        print("[LLM] No GEMINI_API_KEY set, skipping LLM analysis.")
        return None

    prompt = ANALYSIS_PROMPT.format(title=title, description=description)

    for model in GEMINI_MODELS:
        try:
            url = GEMINI_BASE_URL.format(model=model)
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 512,
                },
            }
            response = requests.post(
                url,
                params={"key": api_key},
                json=payload,
                timeout=30,
            )
            if response.status_code == 429:
                print(f"[LLM] Gemini rate limit on {model}, trying next model...")
                continue
            response.raise_for_status()
            data = response.json()
            raw = data["candidates"][0]["content"]["parts"][0]["text"]
            cleaned = _clean_json(raw)
            result = json.loads(cleaned)
            result["model_used"] = f"gemini:{model}"
            print(f"[LLM] Success with Gemini model: {model}")
            return result
        except Exception as e:
            print(f"[LLM] Gemini model {model} failed: {e}")
            continue

    return None
