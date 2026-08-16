import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class QuestionBank:
    def __init__(self):
        self._questions: Dict[str, List[Dict[str, Any]]] = {}

    def add_question(self, skill_id: str, question: Dict[str, Any]) -> None:
        self._questions.setdefault(skill_id, []).append(question)

    def get_questions_by_skill(self, skill_id: str) -> List[Dict[str, Any]]:
        return list(self._questions.get(skill_id, []))

    def get_question(self, question_id: str) -> Optional[Dict[str, Any]]:
        for questions in self._questions.values():
            for q in questions:
                if q.get("id") == question_id:
                    return q
        return None


question_bank = QuestionBank()
