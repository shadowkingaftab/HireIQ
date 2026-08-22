from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.contracts.matching import MatchingRequest, MatchingResult
from backend.app.services.matching_engine import matching_engine

router = APIRouter()


@router.post("/jobs/{job_id}/match", response_model=list[MatchingResult])
def match_candidates_for_job(job_id: int, request: MatchingRequest, db: Session = Depends(get_db)):
    results = matching_engine.rank_candidates(db=db, job_id=job_id, candidate_ids=request.candidate_ids, limit=request.limit)
    return results

