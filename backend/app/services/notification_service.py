from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.models.notification import Notification

class NotificationService:
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
