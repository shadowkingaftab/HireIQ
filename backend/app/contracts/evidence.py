from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel, TimestampModel

class EvidenceBase(CoreModel):
    candidate_id: int
    type: str # e.g., "github", "stack_overflow", "assessment"
    external_id: Optional[str] = None
    content: Dict[str, Any]
    verified: bool = False

class EvidenceCreate(EvidenceBase):
    pass

class Evidence(EvidenceBase, TimestampModel):
    id: int
