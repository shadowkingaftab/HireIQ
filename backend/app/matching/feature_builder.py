import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class FeatureBuilder:
    def build_for_pair(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        job_skills = set(s.lower() for s in job.get("skills", []))
        candidate_skills = set(s.lower() for s in candidate.get("skills", []))
        overlap = job_skills.intersection(candidate_skills)
        return {
            "skill_overlap_count": len(overlap),
            "skill_overlap_ratio": len(overlap) / len(job_skills) if job_skills else 0.0,
            "experience_years": candidate.get("experience_years", 0),
            "evidence_count": len(candidate.get("evidence", [])),
        }


feature_builder = FeatureBuilder()
