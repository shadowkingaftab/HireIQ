from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.services.auth_service import auth_service
from proofhire.backend.app.core.security import create_access_token

def get_current_user(db: Session = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")

def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user
