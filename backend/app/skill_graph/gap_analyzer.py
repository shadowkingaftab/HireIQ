import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class GapAnalyzer:
    def analyze(self, candidate_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        candidate_set = set(s.lower() for s in candidate_skills)
        job_set = set(s.lower() for s in job_skills)
        matched = candidate_set.intersection(job_set)
        missing = job_set - candidate_set
        extra = candidate_set - job_set
        return {
            "matched": sorted(matched),
            "missing": sorted(missing),
            "extra": sorted(extra),
            "coverage": len(matched) / len(job_set) if job_set else 0.0,
        }


gap_analyzer = GapAnalyzer()
