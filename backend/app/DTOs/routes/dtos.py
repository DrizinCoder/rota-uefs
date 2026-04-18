from app.database.enums import BoardingStatus
from sqlmodel import SQLModel, Field
from typing import Optional

class CreateRouteDTO(SQLModel):
    name: str
    boarding_point: str
    drop_off_point: str

class UpdateRouteDTO(SQLModel):
    name: Optional[str] = None
    boarding_point: Optional[str] = None
    drop_off_point: Optional[str] = None
