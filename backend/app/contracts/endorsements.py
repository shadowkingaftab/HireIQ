from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class EndorsementBase(CoreModel):
    candidate_id: int
    endorser_id: int
    skill_id: str
    comment: Optional[str] = None


class EndorsementCreate(EndorsementBase):
    pass


class Endorsement(EndorsementBase, TimestampModel):
    id: int
