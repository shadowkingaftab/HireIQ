from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.repositories.user_repository import user_repository
from backend.app.contracts.users import UserCreate, UserUpdate
from backend.app.models.user import User


class UserService:
    def list(self, db: Session) -> List[User]:
        return user_repository.list(db)

    def create(self, db: Session, *, user_in: UserCreate) -> User:
        return user_repository.create(db, obj_in=user_in)

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return user_repository.get_by_email(db, email=email)

    def update(
        self,
        db: Session,
        *,
        db_obj: User,
        obj_in: UserUpdate,
    ) -> User:
        return user_repository.update(
            db,
            db_obj=db_obj,
            obj_in=obj_in,
        )


user_service = UserService()
