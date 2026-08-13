from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel, TimestampModel

class AssessmentBase(CoreModel):
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    total_score: float = 100.0

class AssessmentCreate(AssessmentBase):
    organization_id: int

class AssessmentUpdate(AssessmentBase):
    pass

class Assessment(AssessmentBase, TimestampModel):
    id: int
    organization_id: int
