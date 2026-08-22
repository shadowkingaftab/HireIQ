from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.integration_connection import IntegrationConnection

class IntegrationRepository(BaseRepository[IntegrationConnection]):
    pass

integration_repository = IntegrationRepository(IntegrationConnection)

