from pydantic import BaseModel, EmailStr

class RequestEmailChangeDTO(BaseModel):
    new_email: EmailStr

class ConfirmEmailChangeDTO(BaseModel):
    token: str
