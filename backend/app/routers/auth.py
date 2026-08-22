from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.contracts.auth import Login
from backend.app.core.security import create_access_token
from backend.app.core.config import settings

router = APIRouter()


@router.post("/login")
def login(credentials: Login, db: Session = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.get("/me")
def get_current_user():
    return {"user": None}

