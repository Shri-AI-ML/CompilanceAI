import uuid
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    clerk_id: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: uuid.UUID
    clerk_id: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
