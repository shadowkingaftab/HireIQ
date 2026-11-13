from backend.app.schemas import CoreModel, TimestampModel
from pydantic import Field


class FeedbackBase(CoreModel):
    application_id: int
    interviewer_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase, TimestampModel):
    id: int

