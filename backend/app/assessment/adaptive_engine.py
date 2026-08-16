import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class AdaptiveEngine:
    def select_next_question(self, *, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not history:
            return {}
        last = history[-1]
        difficulty = last.get("difficulty", "medium")
        if last.get("correct") is True:
            difficulty = "hard" if difficulty == "medium" else "hard"
        elif last.get("correct") is False:
            difficulty = "easy" if difficulty == "medium" else "medium"
        return {"difficulty": difficulty}

    def estimate_ability(self, *, history: List[Dict[str, Any]]) -> float:
        if not history:
            return 0.5
        correct = sum(1 for item in history if item.get("correct"))
        return correct / len(history)


adaptive_engine = AdaptiveEngine()
