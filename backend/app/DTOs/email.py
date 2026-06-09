from pydantic import BaseModel, EmailStr

class RequestEmailChangeDTO(BaseModel):
    new_email: EmailStr
