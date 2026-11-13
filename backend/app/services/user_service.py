from typing import List, Optional

from backend.app.contracts.users import UserCreate, UserUpdate
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.repositories.user_repository import user_repository
from sqlalchemy.orm import Session


class UserService:
    def list(self, db: Session) -> List[User]:
        return user_repository.list(db)

    def create(self, db: Session, *, user_in: UserCreate) -> User:
        values = user_in.model_dump() if hasattr(user_in, "model_dump") else user_in.dict()
        values["hashed_password"] = get_password_hash(values.pop("password"))
        return user_repository.create(db, obj_in=values)

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return user_repository.get_by_email(db, email=email)

    def update(self, db: Session, *, user_id: int, user_in: UserUpdate) -> Optional[User]:
        return self.update_by_id(db, user_id=user_id, user_in=user_in)

    def get(self, db: Session, *, user_id: int) -> Optional[User]:
        return user_repository.get(db, id=user_id)

    def update_by_id(self, db: Session, *, user_id: int, user_in: UserUpdate) -> Optional[User]:
        db_obj = self.get(db, user_id=user_id)
        if db_obj is None:
            return None
        values = user_in.model_dump(exclude_unset=True) if hasattr(user_in, "model_dump") else user_in.dict(exclude_unset=True)
        password = values.pop("password", None)
        if password:
            values["hashed_password"] = get_password_hash(password)
        return user_repository.update(db, db_obj=db_obj, obj_in=values)

    def delete(self, db: Session, *, user_id: int) -> bool:
        user = self.get(db, user_id=user_id)
        if user is None:
            return False
        db.delete(user)
        db.commit()
        return True


user_service = UserService()
