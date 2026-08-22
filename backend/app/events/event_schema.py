from typing import Any, Dict, Optional

from pydantic import BaseModel, Field
from proofhire.backend.app.events.event_types import EventType


class EventSchema(BaseModel):
    event_type: EventType
    entity_type: str
    entity_id: str
    data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None
    version: str = Field(default="1.0")

    class Config:
        use_enum_values = True
