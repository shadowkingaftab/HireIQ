from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.application_repository import application_repository
from proofhire.backend.app.contracts.applications import Application, ApplicationCreate, ApplicationUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Application])
def read_applications(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return application_repository.get_multi(db, skip=skip, limit=limit)

@router.post("", response_model=Application)
def create_application(
    *,
    db: Session = Depends(get_db),
    app_in: ApplicationCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return application_repository.create(db, obj_in=app_in)

@router.get("/{app_id}", response_model=Application)
def read_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    app = application_repository.get(db, id=app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app
