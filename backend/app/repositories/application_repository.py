from backend.app.models.application import Application
from backend.app.repositories.base_repository import BaseRepository


class ApplicationRepository(BaseRepository[Application]):
    pass


application_repository = ApplicationRepository(Application)

