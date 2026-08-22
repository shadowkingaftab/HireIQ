from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.organization import Organization

class OrganizationRepository(BaseRepository[Organization]):
    pass


organization_repository = OrganizationRepository(Organization)
