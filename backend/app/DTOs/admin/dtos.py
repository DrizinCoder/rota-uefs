from pydantic import BaseModel, EmailStr
from typing import Optional

class CreateAdminDTO(BaseModel):
    name: str
    email: EmailStr
    password: str

class UpdateAdminDTO(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class AdminResponseDTO(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class AdminListResponseDTO(BaseModel):
    admins: list[AdminResponseDTO]