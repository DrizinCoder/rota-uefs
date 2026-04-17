from dataclasses import dataclass

@dataclass
class CreateReservaDTO:
    viagem: str
    ida_e_volta: bool

@dataclass
class DeleteReservaDTO:
    reserva_id: str
    viagem: str