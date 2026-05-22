import uuid
from pydantic import BaseModel, ConfigDict
from typing import Optional


# Organization Schemas
class OrganizationBase(BaseModel):
    name: str
    slug: str


class OrganizationCreate(OrganizationBase):
    clerk_org_id: str


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None


class OrganizationResponse(OrganizationBase):
    id: uuid.UUID
    clerk_org_id: str

    model_config = ConfigDict(from_attributes=True)


# Organization Membership Schemas
class OrganizationMembershipBase(BaseModel):
    role: str  # Admin, Manager, Auditor, Viewer


class OrganizationMembershipCreate(OrganizationMembershipBase):
    user_id: uuid.UUID
    organization_id: uuid.UUID


class OrganizationMembershipUpdate(BaseModel):
    role: str


class OrganizationMembershipResponse(OrganizationMembershipBase):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class OrganizationSwitchRequest(BaseModel):
    clerk_org_id: str

