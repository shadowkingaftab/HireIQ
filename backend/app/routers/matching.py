from backend.app.contracts.matching import MatchingRequest, MatchingResult
from backend.app.database import get_db
from backend.app.models.candidate import Candidate
from backend.app.models.job import Job
from backend.app.services.matching_engine import matching_engine
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/jobs/{job_id}/match", response_model=list[MatchingResult])
def match_candidates_for_job(job_id: int, request: MatchingRequest, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if not request.candidate_ids:
        return []
    candidates = (
        db.query(Candidate)
        .filter(Candidate.id.in_(request.candidate_ids))
        .all()
    )
    return matching_engine.rank_candidates(db=db, job=job, candidates=candidates)[: request.limit]

