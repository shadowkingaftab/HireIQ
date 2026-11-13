import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def send_notification_job(payload: Dict[str, Any]) -> None:
    user_id = payload.get("user_id")
    if not user_id:
        logger.warning("Missing user_id in notification job payload")
        return
    try:
        title = payload.get("title")
        message = payload.get("message")
        if not title or not message:
            logger.warning("Notification job is missing title or message")
            return
        from backend.app.database import SessionLocal
        from backend.app.services.notification_service import notification_service
        db = SessionLocal()
        try:
            notification_service.send_notification(
                db,
                user_id=int(user_id),
                title=str(title),
                message=str(message),
                type=str(payload.get("type", "system")),
            )
        finally:
            db.close()
    except Exception:
        logger.exception("Notification job failed for user %s", user_id)

