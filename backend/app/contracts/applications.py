from typing import Optional

from backend.app.core.constants import ApplicationStatus
from backend.app.schemas import CoreModel, TimestampModel


class ApplicationBase(CoreModel):
    job_id: int
    candidate_id: int
    status: ApplicationStatus = ApplicationStatus.APPLIED
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(CoreModel):
    status: Optional[ApplicationStatus] = None


class Application(ApplicationBase, TimestampModel):
    id: int
    score: Optional[float] = None

