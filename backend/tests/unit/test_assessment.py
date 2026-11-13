import asyncio

import pytest
from backend.app.assessment.adaptive_engine import AdaptiveEngine
from backend.app.assessment.answer_evaluator import AnswerEvaluator
from backend.app.assessment.code_runner import CodeRunner
from backend.app.assessment.result_builder import ResultBuilder
from backend.app.assessment.rubric import Rubric


def test_multiple_choice_answer_evaluation():
    evaluator = AnswerEvaluator()
    question = {"type": "multiple_choice", "correct_index": 1}
    assert evaluator.evaluate(question=question, answer=1) == 1.0
    assert evaluator.evaluate(question=question, answer=0) == 0.0


def test_code_grading_does_not_execute_untrusted_code():
    evaluator = AnswerEvaluator()
    with pytest.raises(RuntimeError, match="isolated sandbox"):
        evaluator.evaluate(
            question={"type": "code", "tests": []},
            answer="raise RuntimeError('must not run')",
        )


def test_code_runner_reports_unavailable_without_sandbox():
    result = asyncio.run(
        CodeRunner().run_code(code="print('hello')", language="python", tests=[])
    )
    assert result["passed"] is False
    assert "isolated sandbox" in result["results"][0]["error"]


def test_adaptive_engine_adjusts_difficulty_from_history():
    engine = AdaptiveEngine()
    assert engine.select_next_question(history=[{"difficulty": "medium", "correct": True}]) == {"difficulty": "hard"}
    assert engine.select_next_question(history=[{"difficulty": "medium", "correct": False}]) == {"difficulty": "easy"}


def test_result_builder_calculates_percentage():
    result = ResultBuilder().build(
        attempt_id=42,
        answers=[{"score": 4.0}, {"score": 3.0}],
        total_score=10.0,
    )
    assert result["attempt_id"] == 42
    assert result["score"] == 7.0
    assert result["percentage"] == 0.7


def test_rubric_clamps_scores_to_weighted_range():
    rubric = Rubric()
    rubric.add_criterion("accuracy", weight=0.5, description="Correctness")
    assert rubric.score("accuracy", 2.0) == 0.5
    assert rubric.score("accuracy", -1.0) == 0.0

