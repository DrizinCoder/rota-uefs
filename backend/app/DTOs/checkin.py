from pydantic import BaseModel
import uuid

class CheckinRequestDTO(BaseModel):
    trip_id: uuid.UUID
    checkin_code: str