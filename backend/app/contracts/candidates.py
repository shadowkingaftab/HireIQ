from typing import List, Optional

from backend.app.schemas import CoreModel, TimestampModel
from pydantic import Field


class CandidateBase(CoreModel):
    user_id: int
    summary: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(CoreModel):
    summary: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    skills: Optional[List[str]] = None


class Candidate(CandidateBase, TimestampModel):
    id: int

