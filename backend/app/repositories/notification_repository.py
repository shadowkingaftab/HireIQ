from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.notification import Notification

class NotificationRepository(BaseRepository[Notification]):
    def list_for_user(self, db: Session, *, user_id: int) -> list:
        return db.query(Notification).filter(Notification.user_id == user_id).all()

    def mark_read(self, db: Session, *, notification_id: int):
        db_obj = db.query(Notification).filter(Notification.id == notification_id).first()
        if db_obj:
            db_obj.is_read = True
            db.commit()
            db.refresh(db_obj)
        return db_obj


notification_repository = NotificationRepository(Notification)
