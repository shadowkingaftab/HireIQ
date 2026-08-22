import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def send_notification_job(payload: Dict[str, Any]) -> None:
    user_id = payload.get("user_id")
    if not user_id:
        logger.warning("Missing user_id in notification job payload")
        return
    try:
        from proofhire.backend.app.services.notification_service import notification_service
        await notification_service.send_notification(user_id=user_id, title=payload.get("title"), message=payload.get("message"))
    except Exception:
        logger.exception("Notification job failed for user %s", user_id)
