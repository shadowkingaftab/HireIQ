from typing import Optional, List
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class OrganizationBase(CoreModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(OrganizationBase):
    pass


class Organization(OrganizationBase, TimestampModel):
    id: int
