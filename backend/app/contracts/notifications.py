from typing import Optional, List, Dict, Any
from datetime import datetime
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class NotificationBase(CoreModel):
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool = False


class Notification(NotificationBase, TimestampModel):
    id: int
