from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel


class MatchingResult(CoreModel):
    job_id: int
    candidate_id: int
    score: float
    reasoning: Optional[Dict[str, Any]] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []


class MatchingRequest(CoreModel):
    job_id: int
    candidate_ids: Optional[List[int]] = None
    limit: int = 10
