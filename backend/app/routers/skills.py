from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.repositories.skill_repository import skill_repository
from proofhire.backend.app.contracts.skill_graph import SkillBase

router = APIRouter()

@router.get("", response_model=List[SkillBase])
def read_skills(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return skill_repository.get_multi(db, skip=skip, limit=limit)
