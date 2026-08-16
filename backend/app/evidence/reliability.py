import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


@dataclass
class ReliabilityScore:
    score: float
    source: str
    freshness_days: Optional[int] = None
    verification_status: str = "unverified"
    metadata: Dict[str, Any] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class Reliability:
    def calculate(self, *, source: str, fetched_at: Optional[str] = None, verified: bool = False) -> ReliabilityScore:
        fetched_at = fetched_at or datetime.now(timezone.utc).isoformat()
        freshness = self._freshness_days(fetched_at)
        score = self._base_score(source)
        if verified:
            score += 0.1
        if freshness and freshness > 30:
            score -= 0.05 * min(freshness / 30, 1)
        score = max(0.0, min(1.0, score))
        return ReliabilityScore(score=score, source=source, freshness_days=freshness, verification_status="verified" if verified else "unverified")

    def _base_score(self, source: str) -> float:
        scores = {"github": 0.8, "assessment": 0.9, "resume": 0.5, "certification": 0.85}
        return scores.get(source.lower(), 0.4)

    def _freshness_days(self, fetched_at: str) -> Optional[int]:
        try:
            dt = datetime.fromisoformat(fetched_at.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            return max((now - dt).days, 0)
        except Exception:
            return None


reliability = Reliability()
