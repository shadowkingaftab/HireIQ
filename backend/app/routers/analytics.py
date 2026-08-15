from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.analytics_repository import analytics_repository
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("/org/{org_id}")
def read_org_analytics(
    org_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return analytics_repository.get_org_stats(db, organization_id=org_id)
