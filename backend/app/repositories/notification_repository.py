from typing import List, Optional

from backend.app.models.notification import Notification
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class NotificationRepository(BaseRepository[Notification]):
    def list_for_user(self, db: Session, *, user_id: int) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).all()

    def mark_read(self, db: Session, *, notification_id: int, user_id: int) -> Optional[Notification]:
        db_obj = (
            db.query(Notification)
            .filter(Notification.id == notification_id, Notification.user_id == user_id)
            .first()
        )
        if db_obj:
            setattr(db_obj, "is_read", True)
            db.commit()
            db.refresh(db_obj)
        return db_obj


notification_repository = NotificationRepository(Notification)

