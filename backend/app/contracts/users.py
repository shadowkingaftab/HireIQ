from typing import Optional

from backend.app.schemas import CoreModel
from pydantic import EmailStr


class UserBase(CoreModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


class UserCreate(CoreModel):
    email: EmailStr
    full_name: Optional[str] = None
    password: str


class UserUpdate(CoreModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None


class User(UserInDBBase):
    pass

