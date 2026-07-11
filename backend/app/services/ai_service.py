"""
AI Service – called from FastAPI complaint router.
Bridges the hybrid_analyzer from ai_module/ into the backend.
"""
import sys
import os

# Add ai_module to path
_AI_MODULE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai_module"))
if _AI_MODULE_PATH not in sys.path:
    sys.path.insert(0, _AI_MODULE_PATH)

from typing import Dict


async def analyze_complaint(title: str, description: str) -> Dict:
    """
    Async wrapper for the synchronous hybrid_analyzer.
    Runs in a thread pool so it doesn't block the FastAPI event loop.
    """
    import asyncio
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, _sync_analyze, title, description)
    return result


def _sync_analyze(title: str, description: str) -> Dict:
    try:
        from hybrid_analyzer import analyze
        return analyze(title, description)
    except FileNotFoundError:
        # ML model not trained yet – return safe defaults
        return {
            "category": "Others",
            "confidence": 0.5,
            "sentiment": "Neutral",
            "priority": "Low",
            "summary": f"{title}. {description[:120]}",
            "department_suggestion": "Administration",
            "admin_recommendation": "Please review this complaint manually.",
            "model_used": "fallback",
        }
    except Exception as e:
        print(f"[AIService] Error: {e}")
        return {
            "category": "Others",
            "confidence": 0.0,
            "sentiment": "Neutral",
            "priority": "Low",
            "summary": description[:150],
            "department_suggestion": "Administration",
            "admin_recommendation": "AI analysis unavailable. Manual review required.",
            "model_used": "error",
        }
