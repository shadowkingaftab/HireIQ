import logging
from typing import Any, Dict, List

from proofhire.backend.app.assessment.answer_evaluator import evaluator as answer_evaluator
from proofhire.backend.app.assessment.result_builder import result_builder

logger = logging.getLogger(__name__)


class TestExecutor:
    async def run(self, *, assessment_id: int, candidate_id: int) -> Dict[str, Any]:
        logger.debug("Running assessment %s for candidate %s", assessment_id, candidate_id)
        questions = []
        answers = []
        for question in questions:
            answer = {}
            score = answer_evaluator.evaluate(question=question, answer=answer.get("value"))
            answers.append({"question_id": question.get("id"), "score": score})
        total_score = 100.0
        return result_builder.build(attempt_id=0, answers=answers, total_score=total_score)


test_executor = TestExecutor()
