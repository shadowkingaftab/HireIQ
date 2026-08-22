from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.organization import Organization

class OrganizationRepository(BaseRepository[Organization]):
    pass


organization_repository = OrganizationRepository(Organization)

