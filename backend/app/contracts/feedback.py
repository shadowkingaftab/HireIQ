from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel, TimestampModel

class FeedbackBase(CoreModel):
    application_id: int
    interviewer_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str

class Feedback(FeedbackBase, TimestampModel):
    id: int
