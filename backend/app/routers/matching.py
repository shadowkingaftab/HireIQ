from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.matching_repository import matching_repository
from proofhire.backend.app.contracts.matching import MatchingResult, MatchingRequest
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.post("/run", response_model=List[MatchingResult])
def run_matching(
    *,
    db: Session = Depends(get_db),
    matching_in: MatchingRequest,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    # Logic to trigger matching engine would go here
    return matching_repository.get_matches_for_job(db, job_id=matching_in.job_id, limit=matching_in.limit)
