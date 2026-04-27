from app.enums.enums import BusStatus
from typing import List
from sqlmodel import SQLModel

class BusBatchDeleteDTO(SQLModel):
    bus_plates: List[str]

class BusUpdateDTO(SQLModel):
    capacity: int
    bus_status: BusStatus

class BusBatchUpdateItemDTO(SQLModel):
    bus_plate: str
    capacity: int
    bus_status: BusStatus

class BusUpdateBatchDTO(SQLModel):
    updates: List[BusBatchUpdateItemDTO]

class BusCreateDTO(SQLModel):
    bus_plate: str
    capacity: int
    bus_status: BusStatus

class BusCreateBatchDTO(SQLModel):
    buses: List[BusCreateDTO]