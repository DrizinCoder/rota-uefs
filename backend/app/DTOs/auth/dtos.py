from dataclasses import dataclass

@dataclass
class RegisterServidorDTO:
    name: str
    senha: str
    matricula: str
    telefone: str
    e_mail: str
    departamento: str
    vinculo: str
 
@dataclass
class RegisterUserDTO:
    name: str
    senha: str
    matricula: str
    telefone: str
    e_mail: str
 
@dataclass
class LoginUserDTO:
    matricula: str
    senha: str
    
    