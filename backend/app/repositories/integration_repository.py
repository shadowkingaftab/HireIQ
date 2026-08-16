from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.integration_connection import IntegrationConnection

class IntegrationRepository(BaseRepository[IntegrationConnection]):
    pass

integration_repository = IntegrationRepository(IntegrationConnection)
