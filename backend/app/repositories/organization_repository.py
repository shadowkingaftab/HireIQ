from backend.app.models.organization import Organization
from backend.app.repositories.base_repository import BaseRepository


class OrganizationRepository(BaseRepository[Organization]):
    pass


organization_repository = OrganizationRepository(Organization)

