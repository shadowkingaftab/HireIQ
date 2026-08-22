from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.application import Application

class ApplicationRepository(BaseRepository[Application]):
    pass


application_repository = ApplicationRepository(Application)

