from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.models.match_result import MatchResult
from proofhire.backend.app.contracts.matching import MatchingResult

class MatchingRepository:
    def get_matches_for_job(self, db: Session, *, job_id: int, limit: int = 10) -> List[MatchResult]:
        return (
            db.query(MatchResult)
            .filter(MatchResult.job_id == job_id)
            .order_by(MatchResult.score.desc())
            .limit(limit)
            .all()
        )

    def save_match(self, db: Session, *, match_data: MatchingResult) -> MatchResult:
        db_obj = MatchResult(
            job_id=match_data.job_id,
            candidate_id=match_data.candidate_id,
            score=match_data.score,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

matching_repository = MatchingRepository()
