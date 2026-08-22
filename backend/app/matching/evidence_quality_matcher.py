import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class EvidenceQualityMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        evidence = candidate.get("evidence", [])
        if not evidence:
            return {"score": 0.0, "evidence_count": 0, "avg_reliability": 0.0}
        avg_reliability = sum(e.get("reliability_score", 0.0) for e in evidence) / len(evidence)
        score = min(avg_reliability, 1.0)
        return {"score": score, "evidence_count": len(evidence), "avg_reliability": avg_reliability}


evidence_quality_matcher = EvidenceQualityMatcher()
