from backend.app.contracts.auth import Login, Token
from backend.app.contracts.users import UserCreate
from backend.app.core.constants import UserRole
from backend.app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from backend.app.database import get_db
from backend.app.dependencies.auth import get_current_user
from backend.app.models.role import Role
from backend.app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_active=True,
        is_superuser=False,
    )
    candidate_role = db.query(Role).filter(Role.name == UserRole.CANDIDATE.value).first()
    if candidate_role is None:
        candidate_role = Role(name=UserRole.CANDIDATE.value, description="Candidate")
        db.add(candidate_role)
    user.roles.append(candidate_role)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer")


@router.post("/login", response_model=Token)
def login(credentials: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()
    if not user or not verify_password(credentials.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer")


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    role_names = {role.name for role in current_user.roles}
    role = (
        UserRole.ADMIN.value
        if current_user.is_superuser or UserRole.ADMIN.value in role_names
        else UserRole.RECRUITER.value
        if UserRole.RECRUITER.value in role_names or current_user.recruiter_profile is not None
        else UserRole.CANDIDATE.value
    )
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "is_active": current_user.is_active,
            "is_superuser": current_user.is_superuser,
            "role": role,
        }
    }


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"detail": "Logged out"}


@router.post("/refresh", response_model=Token)
def refresh(current_user: User = Depends(get_current_user)):
    token = create_access_token(subject=current_user.id)
    return Token(access_token=token, token_type="bearer")
