from typing import Any, Dict, Optional

from backend.app.events.event_types import EventType
from pydantic import BaseModel, ConfigDict, Field


class EventSchema(BaseModel):
    model_config = ConfigDict(use_enum_values=True)
    event_type: EventType
    entity_type: str
    entity_id: str
    data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None
    version: str = Field(default="1.0")


