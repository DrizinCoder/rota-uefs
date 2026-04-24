from app.DTOs.auth.dtos import AlunoRegisterResponseDTO
from app.DTOs.auth.dtos import ServidorRegisterResponseDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from app.database.db import get_session
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterAlunoDTO
from fastapi import APIRouter
from app.DTOs.auth.dtos import RegisterServidorDTO, LoginUserDTO
from app.controllers.auth_controller import AuthController

router = APIRouter()


def get_auth_controller(session: AsyncSession = Depends(get_session)) -> AuthController:
    repo = UserRepository(session)
    return AuthController(repo)


@router.post("/register/servidor")
async def register_servidor(dados: RegisterServidorDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    staff = await repo.get_by_email(dados.email)
    
    if staff:
       raise ConflictException("Usuário já cadastrado")

    user_created = await repo.create_staff(dados)
    response_data = ServidorRegisterResponseDTO.model_validate(user_created)

    return ResponseHandler.created(data=response_data.model_dump(mode='json'))
@router.post("/register/aluno")
async def register_aluno(dados: RegisterAlunoDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    student = await repo.get_by_email(dados.email)
    
    if student:
       raise ConflictException("Usuário já cadastrado")

    student_created = await repo.create_student(dados)

    response_data = AlunoRegisterResponseDTO.model_validate(student_created)

    return ResponseHandler.created(data=response_data.model_dump(mode='json'))
    

# Rota unificada de login [Admin, Motorista, Servidor, Aluno]
@router.post("/login")
async def login(
    dados: LoginUserDTO,
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.login(dados)
    return ResponseHandler.ok(data=result)


@router.post("/recover/password")
async def recover_password(email: str):
    return {"message": "olá! bem-vindo a recup de senha"}