from typing import Optional, List
from datetime import datetime
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class InterviewBase(CoreModel):
    application_id: int
    scheduled_at: datetime
    location: Optional[str] = None
    interviewers: List[int] = []


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(CoreModel):
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    interviewers: Optional[List[int]] = None
    status: Optional[str] = None


class Interview(InterviewBase, TimestampModel):
    id: int
    status: str = "scheduled"
