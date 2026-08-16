import logging
from typing import Any, Dict, List

from proofhire.backend.app.evidence.contracts import NormalizedEvidence
from proofhire.backend.app.evidence.confidence import confidence as confidence_service
from proofhire.backend.app.evidence.reliability import reliability as reliability_service

logger = logging.getLogger(__name__)


class Aggregator:
    def aggregate(self, *, evidence_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not evidence_list:
            return {"top_skills": [], "evidence_count": 0, "confidence": 0.0, "reliability": 0.0}
        skills: Dict[str, int] = {}
        reliability_scores = []
        for item in evidence_list:
            source = item.get("source", "unknown")
            rel = reliability_service.calculate(source=source, fetched_at=item.get("timestamp"), verified=bool(item.get("verified")))
            reliability_scores.append(rel.score)
            content = item.get("content", {})
            for skill in content.get("skills", []):
                skills[skill] = skills.get(skill, 0) + 1
        confidence_model = confidence_service.compute(evidence_list)
        top_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)[:20]
        return {
            "top_skills": [skill for skill, _ in top_skills],
            "evidence_count": len(evidence_list),
            "confidence": round(confidence_model.overall, 4),
            "reliability": round(sum(reliability_scores) / len(reliability_scores), 4) if reliability_scores else 0.0,
        }


aggregator = Aggregator()
