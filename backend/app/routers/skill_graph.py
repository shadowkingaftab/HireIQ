from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.repositories.graph_repository import graph_repository

router = APIRouter()

@router.get("/{skill_id}/related")
def read_related_skills(
    skill_id: str,
    depth: int = 1,
    db: Session = Depends(get_db),
) -> Any:
    return graph_repository.get_related_skills(db, skill_id=skill_id, depth=depth)
