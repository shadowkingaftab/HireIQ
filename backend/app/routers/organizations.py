from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.organizations import OrganizationCreate, OrganizationUpdate, Organization
from proofhire.backend.app.services.organization_service import organization_service

router = APIRouter()


@router.get("/", response_model=list[Organization])
def list_organizations(db: Session = Depends(get_db)):
    return organization_service.list(db=db)


@router.post("/", response_model=Organization, status_code=status.HTTP_201_CREATED)
def create_organization(org_in: OrganizationCreate, db: Session = Depends(get_db)):
    return organization_service.create(db=db, org_in=org_in)


@router.get("/{organization_id}", response_model=Organization)
def get_organization(organization_id: int, db: Session = Depends(get_db)):
    org = organization_service.get(db=db, organization_id=organization_id)
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org
