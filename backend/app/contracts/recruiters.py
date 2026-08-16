from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class RecruiterBase(CoreModel):
    user_id: int
    organization_id: int
    title: Optional[str] = None


class RecruiterCreate(RecruiterBase):
    pass


class RecruiterUpdate(RecruiterBase):
    pass


class Recruiter(RecruiterBase, TimestampModel):
    id: int
