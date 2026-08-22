import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.citation_builder import citation_builder
from proofhire.backend.app.evidence.explanation_builder import explanation_builder

logger = logging.getLogger(__name__)


class Explanation:
    def build(self, *, job: Dict[str, Any], candidate: Dict[str, Any], score: float, matched_skills: List[str], missing_skills: List[str]) -> Dict[str, Any]:
        reasons = []
        if matched_skills:
            reasons.append(f"Matched skills: {', '.join(matched_skills)}")
        if missing_skills:
            reasons.append(f"Missing skills: {', '.join(missing_skills)}")
        text = "; ".join(reasons) if reasons else "Partial match based on available evidence."
        return {
            "score": score,
            "text": text,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "citations": [],
        }


explanation = Explanation()
