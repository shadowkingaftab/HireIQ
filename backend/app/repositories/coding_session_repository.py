from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.coding_session import CodingSession

class CodingSessionRepository(BaseRepository[CodingSession]):
    pass


coding_session_repository = CodingSessionRepository(CodingSession)

