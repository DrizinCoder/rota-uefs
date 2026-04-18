from dataclasses import dataclass
from typing import Optional

@dataclass
class CreateRouteDTO:
    name: str
    boarding_point: str
    drop_off_point: str

@dataclass
class UpdateRouteDTO:
    name: Optional[str] = None
    boarding_point: Optional[str] = None
    drop_off_point: Optional[str] = None