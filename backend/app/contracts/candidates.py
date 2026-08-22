from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class CandidateBase(CoreModel):
    user_id: int
    summary: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    skills: List[str] = []


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(CandidateBase):
    pass


class Candidate(CandidateBase, TimestampModel):
    id: int
