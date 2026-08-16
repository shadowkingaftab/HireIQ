import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Rubric:
    def __init__(self):
        self._criteria: Dict[str, Dict[str, Any]] = {}

    def add_criterion(self, criterion_id: str, weight: float, description: str) -> None:
        self._criteria[criterion_id] = {"weight": weight, "description": description}

    def score(self, criterion_id: str, value: float) -> float:
        criterion = self._criteria.get(criterion_id)
        if criterion is None:
            return 0.0
        return max(0.0, min(1.0, value)) * criterion["weight"]

    def total_weight(self) -> float:
        return sum(c["weight"] for c in self._criteria.values())


rubric = Rubric()
