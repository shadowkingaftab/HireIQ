from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.organizations import OrganizationCreate, OrganizationUpdate
from proofhire.backend.app.models.organization import Organization

class OrganizationService:
    def list(self, db: Session) -> List[Organization]:
        return db.query(Organization).all()

    def get(self, db: Session, *, organization_id: int) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.id == organization_id).first()

    def create(self, db: Session, *, org_in: OrganizationCreate) -> Organization:
        db_obj = Organization(**org_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Organization, obj_in: OrganizationUpdate) -> Organization:
        for field, value in obj_in.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj


organization_service = OrganizationService()
