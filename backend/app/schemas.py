from typing import Optional, Generic, TypeVar, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CoreModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class TimestampModel(CoreModel):
    created_at: datetime
    updated_at: datetime

class MessageResponse(CoreModel):
    message: str

class ErrorDetail(CoreModel):
    message: str
    code: Optional[str] = None
    details: Optional[dict] = None

class ErrorResponse(CoreModel):
    error: ErrorDetail
