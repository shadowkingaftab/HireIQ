import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class GraphMatcher:
    def match(self, *, job: Dict[str, Any], candidate: Dict[str, Any]) -> Dict[str, Any]:
        job_skills = set(job.get("skills", []))
        candidate_skills = set(candidate.get("skills", []))
        overlap = job_skills.intersection(candidate_skills)
        score = len(overlap) / len(job_skills) if job_skills else 0.0
        return {"score": score, "matched_skills": list(overlap), "missing_skills": list(job_skills - candidate_skills)}


graph_matcher = GraphMatcher()
