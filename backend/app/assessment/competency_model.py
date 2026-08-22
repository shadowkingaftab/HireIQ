import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class CompetencyModel:
    def __init__(self):
        self._skills: Dict[str, Dict[str, Any]] = {}

    def register_skill(self, skill_id: str, competency: Dict[str, Any]) -> None:
        self._skills[skill_id] = competency

    def get_competency(self, skill_id: str) -> Dict[str, Any]:
        return self._skills.get(skill_id, {"level": 0, "confidence": 0.0})

    def list_skills(self) -> List[str]:
        return list(self._skills.keys())


competency_model = CompetencyModel()
