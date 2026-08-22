import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class ConfidenceModel:
    evidence_count: int = 0
    avg_reliability: float = 0.0
    consistency: float = 0.0
    recency_score: float = 0.0
    overall: float = 0.0

    def __post_init__(self):
        self._recalculated = False

    def recalculate(self) -> None:
        if self._recalculated:
            return
        self.overall = (
            0.4 * min(self.evidence_count / 5, 1.0)
            + 0.3 * self.avg_reliability
            + 0.2 * self.consistency
            + 0.1 * self.recency_score
        )
        self.overall = max(0.0, min(1.0, self.overall))
        self._recalculated = True


class Confidence:
    def compute(self, evidence_items: List[Dict[str, Any]]) -> ConfidenceModel:
        if not evidence_items:
            return ConfidenceModel()
        reliabilities = [item.get("reliability_score", 0.0) for item in evidence_items if item.get("reliability_score") is not None]
        avg_reliability = sum(reliabilities) / len(reliabilities) if reliabilities else 0.0
        consistency = self._consistency(evidence_items)
        recency_score = self._recency(evidence_items)
        model = ConfidenceModel(
            evidence_count=len(evidence_items),
            avg_reliability=avg_reliability,
            consistency=consistency,
            recency_score=recency_score,
        )
        model.recalculate()
        return model

    def _consistency(self, evidence_items: List[Dict[str, Any]]) -> float:
        sources = [item.get("source") for item in evidence_items]
        unique = len(set(sources))
        return min(unique / max(len(sources), 1), 1.0)

    def _recency(self, evidence_items: List[Dict[str, Any]]) -> float:
        ages = []
        for item in evidence_items:
            ts = item.get("timestamp") or item.get("created_at")
            if not ts:
                continue
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                age_days = max((datetime.now(timezone.utc) - dt).total_seconds() / 86400.0, 0)
                ages.append(age_days)
            except Exception:
                continue
        if not ages:
            return 0.0
        avg_age = sum(ages) / len(ages)
        return max(0.0, min(1.0, 1.0 - avg_age / 365.0))


confidence = Confidence()
