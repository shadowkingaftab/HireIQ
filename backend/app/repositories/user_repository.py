from typing import Optional

from backend.app.models.user import User
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class UserRepository(BaseRepository[User]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()


user_repository = UserRepository(User)


