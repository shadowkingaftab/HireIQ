from typing import Optional, List
from pydantic import Field
from proofhire.backend.app.schemas import CoreModel, TimestampModel
from proofhire.backend.app.core.constants import JobStatus


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
