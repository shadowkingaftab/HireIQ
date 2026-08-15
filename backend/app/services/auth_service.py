from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.core import security
from proofhire.backend.app.core.config import settings
from proofhire.backend.app.repositories.user_repository import user_repository
from proofhire.backend.app.models.user import User

class AuthService:
    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        return user_repository.authenticate(db, email=email, password=password)

    def create_access_token(self, user_id: int) -> str:
        expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return security.create_access_token(user_id, expires_delta=expires)

auth_service = AuthService()
