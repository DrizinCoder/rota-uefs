from pydantic import BaseModel
class CheckinRequestDTO(BaseModel):
    checkin_code: str