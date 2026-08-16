from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.core.security import create_access_token, verify_password, get_password_hash
from proofhire.backend.app.models.user import User
from proofhire.backend.app.models.refresh_token import RefreshToken
from proofhire.backend.app.core.config import settings

class AuthService:
    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def create_access_token(self, *, user: User) -> str:
        return create_access_token(subject=str(user.id))

    def create_refresh_token(self, db: Session, *, user: User) -> str:
        import secrets
        token = secrets.token_urlsafe(64)
        db_obj = RefreshToken(user_id=user.id, token=token, expires_at=None)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return token

    def revoke_refresh_token(self, db: Session, *, token: str) -> None:
        db_obj = db.query(RefreshToken).filter(RefreshToken.token == token).first()
        if db_obj:
            db_obj.revoked = True
            db.commit()


auth_service = AuthService()
