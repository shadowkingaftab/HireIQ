from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_active_superuser, get_current_user
from proofhire.backend.app.repositories.user_repository import user_repository
from proofhire.backend.app.contracts.users import User, UserCreate, UserUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return current_user

@router.post("", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    user = user_repository.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    return user_repository.create(db, obj_in=user_in)

@router.get("", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    return user_repository.get_multi(db, skip=skip, limit=limit)
