from typing import Optional

from backend.app.core.constants import JobStatus
from backend.app.schemas import CoreModel, TimestampModel


class JobBase(CoreModel):
    title: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    status: JobStatus = JobStatus.DRAFT


class JobCreate(JobBase):
    organization_id: int


class JobUpdate(JobBase):
    pass


class Job(JobBase, TimestampModel):
    id: int
    organization_id: int
    recruiter_id: int

