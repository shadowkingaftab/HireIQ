from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.application import Application

class ApplicationRepository(BaseRepository[Application]):
    pass


application_repository = ApplicationRepository(Application)
