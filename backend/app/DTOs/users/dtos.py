from pydantic import validator
from pydantic import EmailStr, Field
from sqlmodel import SQLModel
from typing import Optional
import re

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

class PasswordUpdate(SQLModel):
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

class PhoneUpdate(SQLModel):
    phone: str

    @validator('phone')
    def validate_phone(cls, v):
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError('Formato de telefone inválido')
        return v
