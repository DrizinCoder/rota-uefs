from pydantic import BaseModel
import uuid

class CheckinRequestDTO(BaseModel):
    trip_id: uuid.UUID
    checkin_code: str

class ManualCheckinRequestDTO(BaseModel):
    user_id: str
    reservation_id: str
    trip_id: str