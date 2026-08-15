from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.organization_repository import organization_repository
from proofhire.backend.app.contracts.organizations import OrganizationCreate, OrganizationUpdate
from proofhire.backend.app.models.organization import Organization

class OrganizationService:
    def create(self, db: Session, *, org_in: OrganizationCreate) -> Organization:
        # Business logic for org creation (e.g. slug generation)
        return organization_repository.create(db, obj_in=org_in)

    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Organization]:
        return organization_repository.get_by_slug(db, slug=slug)

organization_service = OrganizationService()
