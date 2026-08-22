from typing import Generic, List, Optional, TypeVar
from sqlalchemy.orm import Session
from sqlalchemy import select

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model: type[T]):
        self.model = model

    def get(self, db: Session, id: int) -> Optional[T]:
        return db.get(self.model, id)

    def list(self, db: Session) -> List[T]:
        return db.execute(select(self.model)).scalars().all()

    def create(self, db: Session, *, obj_in: Any) -> T:
        db_obj = self.model(**obj_in.dict() if hasattr(obj_in, "dict") else obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: T, obj_in: Any) -> T:
        for field, value in (obj_in.dict(exclude_unset=True) if hasattr(obj_in, "dict") else obj_in).items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: int) -> None:
        db_obj = db.get(self.model, id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
