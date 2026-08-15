from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class NormalizedEvidence(BaseModel):
    source: str
    type: str
    content: Dict[str, Any]
    raw_id: str
    timestamp: Optional[str] = None

class EvidenceInsight(BaseModel):
    skill_id: str
    confidence: float
    evidence_ids: List[int]
