from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.capability_score import CapabilityScore

class CapabilityScoreRepository(BaseRepository[CapabilityScore]):
    pass


capability_score_repository = CapabilityScoreRepository(CapabilityScore)

