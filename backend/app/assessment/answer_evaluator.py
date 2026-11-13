import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


class AnswerEvaluator:
    def evaluate(self, *, question: Dict[str, Any], answer: Any) -> float:
        qtype = question.get("type")
        if qtype == "multiple_choice":
            return 1.0 if answer == question.get("correct_index") else 0.0
        if qtype == "code":
            return self._evaluate_code(question, answer)
        return 0.0

    def _evaluate_code(self, question: Dict[str, Any], answer: str) -> float:
        # Never execute candidate code in the API process. Code questions need a
        # separately isolated runner before they can be safely graded.
        raise RuntimeError("Code grading is unavailable until an isolated sandbox is configured")

evaluator = AnswerEvaluator()
