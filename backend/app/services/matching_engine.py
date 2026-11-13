from typing import Any, Dict, List

from backend.app.contracts.matching import MatchingResult
from backend.app.models.candidate import Candidate
from backend.app.models.job import Job
from backend.app.services.scoring_engine import scoring_engine
from sqlalchemy.orm import Session


class MatchingEngine:
    def match_candidate_to_job(self, db: Session, *, job: Job, candidate: Candidate) -> MatchingResult:
        skills_data: Any = candidate.skills_data or {}
        if isinstance(skills_data, dict):
            candidate_skills = skills_data.get("skills", list(skills_data.keys()))
        else:
            candidate_skills = skills_data

        candidate_evidence = [
            {
                "reliability_score": (evidence.content or {}).get("reliability_score", 0.0)
                if isinstance(evidence.content, dict)
                else 0.0
            }
            for evidence in candidate.evidence
        ]
        job_data: Dict[str, Any] = {"skills": job.ideal_skills or []}
        candidate_data = {
            "skills": candidate_skills or [],
            "experience_years": 0,
            "evidence": candidate_evidence,
        }
        score_data = scoring_engine.calculate_score(job=job_data, candidate=candidate_data)
        
        return MatchingResult(
            job_id=int(job.id),
            candidate_id=int(candidate.id),
            score=score_data["total_score"],
            matched_skills=score_data["matched_skills"],
            missing_skills=score_data["missing_skills"],
            reasoning=score_data["reasoning"]
        )

    def rank_candidates(self, db: Session, *, job: Job, candidates: List[Candidate]) -> List[MatchingResult]:
        results = [self.match_candidate_to_job(db, job=job, candidate=c) for c in candidates]
        return sorted(results, key=lambda x: x.score, reverse=True)

matching_engine = MatchingEngine()

