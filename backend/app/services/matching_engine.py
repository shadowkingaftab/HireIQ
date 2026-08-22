from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate
from proofhire.backend.app.services.scoring_engine import scoring_engine
from proofhire.backend.app.contracts.matching import MatchingResult

class MatchingEngine:
    def match_candidate_to_job(self, db: Session, *, job: Job, candidate: Candidate) -> MatchingResult:
        # Core matching logic using the scoring engine
        score_data = scoring_engine.calculate_score(job=job, candidate=candidate)
        
        return MatchingResult(
            job_id=job.id,
            candidate_id=candidate.id,
            score=score_data["total_score"],
            matched_skills=score_data["matched_skills"],
            missing_skills=score_data["missing_skills"],
            reasoning=score_data["reasoning"]
        )

    def rank_candidates(self, db: Session, *, job: Job, candidates: List[Candidate]) -> List[MatchingResult]:
        results = [self.match_candidate_to_job(db, job=job, candidate=c) for c in candidates]
        return sorted(results, key=lambda x: x.score, reverse=True)

matching_engine = MatchingEngine()
