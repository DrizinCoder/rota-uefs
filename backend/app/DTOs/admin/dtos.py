from dataclasses import dataclass

@dataclass
class CreateAdminDTO:
    nome: str
    email: str
    senha: str