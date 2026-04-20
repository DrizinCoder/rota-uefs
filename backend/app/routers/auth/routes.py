from app.DTOs.auth.dtos import AlunoRegisterResponseDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from app.database.db import get_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterAlunoDTO
from fastapi import APIRouter
from app.DTOs.auth.dtos import RegisterServidorDTO, LoginUserDTO

router = APIRouter()

@router.post("/register/servidor")
async def register_servidor(dados: RegisterServidorDTO):
  return {"message": "olá! bem-vindo a registro de servidor"}

@router.post("/register/aluno")
async def register_aluno(dados: RegisterAlunoDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    student = await repo.get_by_email(dados.email)
    
    if student:
       raise ConflictException("Usuário já cadastrado")

    student_created = await repo.create_student(dados)

    response_data = AlunoRegisterResponseDTO.model_validate(student_created)

    return ResponseHandler.created(data=response_data.model_dump(mode='json'))
    
@router.post("/login/admin")
async def login(dados: LoginUserDTO):
    return {"message": "olá! bem-vindo a login de adm"}

@router.post("/login")
async def login(dados: LoginUserDTO):
    return {"message": "olá! bem-vindo a login"}

@router.post("/recover/password")
async def login(email: str):
    return {"message": "olá! bem-vindo a recup de senha"}
