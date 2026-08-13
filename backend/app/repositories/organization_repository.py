from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.organization import Organization
from proofhire.backend.app.contracts.organizations import OrganizationCreate, OrganizationUpdate

class OrganizationRepository(BaseRepository[Organization, OrganizationCreate, OrganizationUpdate]):
    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.slug == slug).first()

organization_repository = OrganizationRepository(Organization)
