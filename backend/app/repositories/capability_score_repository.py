from backend.app.models.capability_score import CapabilityScore
from backend.app.repositories.base_repository import BaseRepository


class CapabilityScoreRepository(BaseRepository[CapabilityScore]):
    pass


capability_score_repository = CapabilityScoreRepository(CapabilityScore)

