from fastapi import APIRouter
from app.DTOs.auth import RegisterServidorDTO, RegisterUserDTO, LoginUserDTO

router = APIRouter()

@router.post("/register/servidor")
async def register_servidor(dados: RegisterServidorDTO):
  return {"message": "olá! bem-vindo a registro de servidor"}

@router.post("/register/motorista")
async def register_motorista(dados: RegisterUserDTO):
    return {"message": "olá! bem-vindo a registro de motorista"}

@router.post("/register/estudante")
async def register_estudante(dados: RegisterUserDTO):
    return {"message": "olá! bem-vindo a registro de estudantes"}

@router.post("/register/admin")
async def register_administrador(dados: RegisterUserDTO):
    return {"message": "olá! bem-vindo a registro de admin"}

@router.post("/login/admin")
async def login(dados: LoginUserDTO):
    return {"message": "olá! bem-vindo a login de adm"}

@router.post("/login")
async def login(dados: LoginUserDTO):
    return {"message": "olá! bem-vindo a login"}

@router.post("/recover/password")
async def login(email: str):
    return {"message": "olá! bem-vindo a recup de senha"}
