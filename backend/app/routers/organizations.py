from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from proofhire.backend.app.dependencies.database import get_db
from proofhire.backend.app.dependencies.auth import get_current_user
from proofhire.backend.app.repositories.organization_repository import organization_repository
from proofhire.backend.app.contracts.organizations import Organization, OrganizationCreate, OrganizationUpdate
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("", response_model=List[Organization])
def read_organizations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return organization_repository.get_multi(db, skip=skip, limit=limit)

@router.post("", response_model=Organization)
def create_organization(
    *,
    db: Session = Depends(get_db),
    org_in: OrganizationCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return organization_repository.create(db, obj_in=org_in)

@router.get("/{org_id}", response_model=Organization)
def read_organization(
    org_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    org = organization_repository.get(db, id=org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org
