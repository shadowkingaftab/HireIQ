import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class ScoreCalibrator:
    def __init__(self):
        self._min = 0.0
        self._max = 1.0

    def calibrate(self, score: float) -> float:
        score = max(self._min, min(self._max, score))
        return round(score, 4)

    def set_bounds(self, min_value: float, max_value: float) -> None:
        self._min = min_value
        self._max = max_value


score_calibrator = ScoreCalibrator()
