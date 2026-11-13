from backend.app.models.coding_session import CodingSession
from backend.app.repositories.base_repository import BaseRepository


class CodingSessionRepository(BaseRepository[CodingSession]):
    pass


coding_session_repository = CodingSessionRepository(CodingSession)

