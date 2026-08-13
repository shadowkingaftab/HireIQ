from typing import Optional, List
from datetime import datetime
from proofhire.backend.app.schemas import CoreModel, TimestampModel

class InterviewBase(CoreModel):
    application_id: int
    scheduled_at: datetime
    location: Optional[str] = None # Link or physical location
    interviewers: List[int] = []

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase, TimestampModel):
    id: int
    status: str = "scheduled"
