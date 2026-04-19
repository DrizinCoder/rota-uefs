from app.database.enums import EmploymentType
from pydantic import EmailStr
from pydantic import Field
from sqlmodel import SQLModel

class RegisterServidorDTO(SQLModel):
    name: str = Field(min_length=3)
    senha: str = Field(min_length=8)
    matricula: str
    telefone: str
    e_mail: EmailStr
    departamento: str
    vinculo: EmploymentType
 
class RegisterUserDTO(SQLModel):
    name: str = Field(min_length=3)
    senha: str = Field(min_length=8)
    matricula: str
    telefone: str
    e_mail: EmailStr
 
class LoginUserDTO(SQLModel):
    matricula: str
    senha: str
    
    