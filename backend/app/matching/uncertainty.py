import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Uncertainty:
    def estimate(self, *, score: float, evidence_count: int) -> Dict[str, Any]:
        if evidence_count == 0:
            uncertainty = 1.0
        elif evidence_count < 3:
            uncertainty = 0.5
        else:
            uncertainty = max(0.0, 1.0 - evidence_count / 10.0)
        confidence = max(0.0, min(1.0, score)) * (1.0 - uncertainty)
        return {"uncertainty": round(uncertainty, 4), "confidence": round(confidence, 4)}


uncertainty = Uncertainty()
