import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class QuestionSelector:
    def __init__(self, question_bank: Any = None):
        self.question_bank = question_bank

    def select(self, *, skill_ids: List[str], count: int = 10, difficulty: str = "medium") -> List[Dict[str, Any]]:
        questions: List[Dict[str, Any]] = []
        for skill_id in skill_ids:
            if self.question_bank:
                questions.extend(self.question_bank.get_questions_by_skill(skill_id))
        return questions[:count]


question_selector = QuestionSelector()
