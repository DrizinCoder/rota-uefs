from dataclasses import dataclass

@dataclass
class UpdateProfileUserDTO:
    telefone: str | None
    password: str | None
   
@dataclass
class UpdateProfileServidorDTO:
    telefone: str | None
    e_mail: str | None
    password: str | None
   
@dataclass
class UpdateProfileMotoristaDTO:
    telefone: str | None
    
