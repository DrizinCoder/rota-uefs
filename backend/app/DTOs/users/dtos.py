from pydantic import EmailStr, Field
from sqlmodel import SQLModel
from typing import Optional

from app.enums.enums import UserProfile

class BaseProfileUpdate(SQLModel):
    phone: Optional[str] = None
    password: Optional[str] = None

class UpdateProfileUserDTO(BaseProfileUpdate):
    pass

class UpdateProfileServidorDTO(BaseProfileUpdate):
    e_mail: Optional[EmailStr] = None

class UserBaseDTO(SQLModel):
    full_name: str = Field(min_length=3)
    registration_id: str
    phone: str
    email: Optional[EmailStr] = None
    password: str = Field(min_length=8)
    profile: UserProfile

class CreateStaffDTO(UserBaseDTO):
    employment_type: str 
    department: str

class CreateAdminDTO(UserBaseDTO):
    access_level: str 

class CreateSimpleUserDTO(UserBaseDTO):
    pass
