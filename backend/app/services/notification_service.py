from typing import List, Optional

from backend.app.models.notification import Notification
from backend.app.repositories.notification_repository import notification_repository
from sqlalchemy.orm import Session


class NotificationService:
    def list_for_user(self, db: Session, *, user_id: int) -> List[Notification]:
        return notification_repository.list_for_user(db, user_id=user_id)

    def mark_read(self, db: Session, *, notification_id: int, user_id: int) -> Optional[Notification]:
        return notification_repository.mark_read(
            db, notification_id=notification_id, user_id=user_id
        )

    def send_notification(self, db: Session, *, user_id: int, title: str, message: str, type: str):
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type
        )
        db.add(notification)
        db.commit()
        # Logic to send email/push could go here
        return notification

notification_service = NotificationService()

