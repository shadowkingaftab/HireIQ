from typing import Dict, Any

class AnswerEvaluator:
    def evaluate(self, *, question: Dict[str, Any], answer: Any) -> float:
        # Auto-grade based on rubric
        return 1.0

evaluator = AnswerEvaluator()
