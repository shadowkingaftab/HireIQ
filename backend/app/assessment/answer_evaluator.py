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
        tests = question.get("tests", [])
        if not tests:
            return 0.0
        passed = 0
        for test in tests:
            if self._run_test(answer, test):
                passed += 1
        return passed / len(tests)

    def _run_test(self, code: str, test: Dict[str, Any]) -> bool:
        try:
            compiled = compile(code, "<string>", "exec")
            namespace: Dict[str, Any] = {}
            exec(compiled, namespace)
            func = namespace.get(test.get("function"))
            if func is None:
                return False
            return func(*test.get("args", [])) == test.get("expected")
        except Exception:
            return False


evaluator = AnswerEvaluator()
