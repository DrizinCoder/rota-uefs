from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from app.database.db import get_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterAlunoDTO
from fastapi import APIRouter
from app.DTOs.auth.dtos import RegisterServidorDTO, RegisterUserDTO, LoginUserDTO

router = APIRouter()

@router.post("/register/servidor")
async def register_servidor(dados: RegisterServidorDTO):
  return {"message": "olá! bem-vindo a registro de servidor"}

@router.post("/register/motorista")
async def register_motorista(dados: RegisterUserDTO):
    return {"message": "olá! bem-vindo a registro de motorista"}

@router.post("/register/aluno")
async def register_aluno(dados: RegisterAlunoDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    student = repo.find_by_email(dados.email)
    
    if student:
        raise ConflictException("Usuário já cadastrado")

    student_created = repo.create_user(dados)

    return ResponseHandler.created(student_created)

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
