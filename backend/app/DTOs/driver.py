from pydantic import EmailStr
from sqlmodel import Field, SQLModel

class DriverPatchDTO(SQLModel):
  full_name: str
  email: EmailStr = Field(nullable=False)
  phone: str
  registration_id: str
