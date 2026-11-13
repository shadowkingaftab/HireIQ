from typing import Any, Dict, List, Optional

from backend.app.schemas import CoreModel
from pydantic import Field


class MatchingResult(CoreModel):
    job_id: int
    candidate_id: int
    score: float
    reasoning: Optional[Dict[str, Any]] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []


class MatchingRequest(CoreModel):
    candidate_ids: Optional[List[int]] = None
    limit: int = Field(default=10, ge=1, le=100)

