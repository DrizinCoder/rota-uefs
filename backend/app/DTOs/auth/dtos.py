from app.enums.enums import AccessLevel
from random import random
from typing import Optional
import uuid
from datetime import datetime
from pydantic import field_validator
from app.enums.enums import RegistrationStatus
from app.enums.enums import UserProfile
from app.enums.enums import EmploymentType
from pydantic import EmailStr
from pydantic import Field
from sqlmodel import SQLModel
import re

class RegisterServidorDTO(SQLModel):
    name: str = Field(min_length=3)
    senha: str = Field(min_length=8)
    matricula: str
    telefone: str
    e_mail: EmailStr
    departamento: str
    vinculo: EmploymentType

class RegisterMotoristaDTO(SQLModel):
    full_name: str = Field(min_length=3)
    registration_id: str
    phone: str
    email: Optional[EmailStr] = None
    profile: UserProfile = UserProfile.DRIVER
    registration_status: RegistrationStatus = RegistrationStatus.ACTIVE
    password: Optional[str] = None 

class RegisterAdminDTO(SQLModel):
    full_name: str = Field(min_length=3)
    registration_id: str
    phone: Optional[str] = "Not Defined"
    email: Optional[EmailStr] = None
    profile: UserProfile = UserProfile.ADMIN
    registration_status: RegistrationStatus = RegistrationStatus.ACTIVE
    password: Optional[str] = None 
    access_level: Optional[AccessLevel] = AccessLevel.OPERATOR

class RegisterAlunoDTO(SQLModel):
    full_name: str = Field(min_length=3)
    password: str = Field(min_length=8)
    registration_id: str
    phone: str
    email: EmailStr    
    profile: UserProfile = UserProfile.STUDENT
    registration_status: RegistrationStatus = RegistrationStatus.PENDING

    @field_validator("registration_id")
    @classmethod
    def validate_registration_id(cls, v: str) -> str:
        v_year = v[0:2]
        year = datetime.now().year - 2000
        semester = v[2:3]

        if int(v_year) > year:
            raise ValueError("Matrícula Inválida")

        if not any(semester == n for n in ['1', '2']):
            raise ValueError("Matrícula Inválida")
        
        if not re.match(r"^\d{8}$", v):
            raise ValueError("Matrícula Inválida")
        return v

    @field_validator("email")
    @classmethod
    def validate_institutional_email(cls, v: str, info) -> str:
        matricula = info.data.get("registration_id")
        expected_email = f"{matricula}@discente.uefs.br"
        if v != expected_email:
            raise ValueError("E-mail Inválido")
        return v

class LoginUserDTO(SQLModel):
    matricula: str
    senha: str

class AlunoRegisterResponseDTO(SQLModel):
    user_id: uuid.UUID
    full_name: str
    registration_id: str
    email: str

class MotoristaRegisterResponseDTO(SQLModel):
    user_id: uuid.UUID
    full_name: str
    registration_id: str
    phone: str

class AdminRegisterResponseDTO(SQLModel):
    user_id: uuid.UUID
    full_name: str
    registration_id: str