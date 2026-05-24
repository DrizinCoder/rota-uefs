from pydantic import field_validator
from pydantic import EmailStr, Field
from sqlmodel import SQLModel
from typing import Optional
import re

from app.enums.enums import UserProfile

class UserBaseDTO(SQLModel):
    full_name: str = Field(min_length=3)
    registration_id: str
    phone: str
    email: Optional[EmailStr] = None
    password: str = Field(min_length=8)
    profile: UserProfile

class CreateAdminDTO(UserBaseDTO):
    access_level: str 

class PasswordUpdate(SQLModel):
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

class PhoneUpdate(SQLModel):
    phone: str

    @field_validator('phone')
    def validate_phone(cls, v):
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError('Formato de telefone inválido')
        return v

class CheckinCodeRequest(SQLModel):
    trip_id: str