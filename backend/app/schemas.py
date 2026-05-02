from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict
import uuid

class CandidateBase(BaseModel):
    name: Optional[str] = None
    email: str
    github_username: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: uuid.UUID
    
    model_config = ConfigDict(from_attributes=True)

class JobBase(BaseModel):
    title: str
    description: str
    required_skills: Optional[List[str]] = None
    nice_to_have_skills: Optional[List[str]] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class JDInput(BaseModel):
    text: str

class MatchRequest(BaseModel):
    candidate_data: Dict[str, Any]
    jd_data: Dict[str, Any]
    github_data: Optional[Dict[str, Any]] = None

class FeedbackCreate(BaseModel):
    candidate_id: str
    job_id: str
    hired: bool
    performance_score: Optional[float] = None
    notes: Optional[str] = None

class CheckoutRequest(BaseModel):
    plan_type: str
    success_url: str
    cancel_url: str

class NoteCreate(BaseModel):
    note: str
