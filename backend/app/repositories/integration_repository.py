from backend.app.models.integration_connection import IntegrationConnection
from backend.app.repositories.base_repository import BaseRepository


class IntegrationRepository(BaseRepository[IntegrationConnection]):
    pass

integration_repository = IntegrationRepository(IntegrationConnection)

