import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class ResultBuilder:
    def build(self, *, attempt_id: int, answers: List[Dict[str, Any]], total_score: float) -> Dict[str, Any]:
        score = sum(item.get("score", 0.0) for item in answers)
        percentage = score / total_score if total_score else 0.0
        return {"attempt_id": attempt_id, "score": score, "percentage": percentage, "answers": answers}


result_builder = ResultBuilder()
