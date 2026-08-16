from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.capability_score import CapabilityScore

class CapabilityScoreRepository(BaseRepository[CapabilityScore]):
    pass


capability_score_repository = CapabilityScoreRepository(CapabilityScore)
