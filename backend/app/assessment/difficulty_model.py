import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class DifficultyModel:
    def __init__(self):
        self._levels: Dict[str, float] = {"easy": 0.2, "medium": 0.5, "hard": 0.8}

    def get_difficulty(self, level: str) -> float:
        return self._levels.get(level.lower(), 0.5)

    def adjust_difficulty(self, current: str, correct: bool) -> str:
        levels = ["easy", "medium", "hard"]
        index = levels.index(current) if current in levels else 1
        if correct:
            index = min(index + 1, len(levels) - 1)
        else:
            index = max(index - 1, 0)
        return levels[index]


difficulty_model = DifficultyModel()
