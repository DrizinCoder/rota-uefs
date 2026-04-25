from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from app.DTOs.auth.dtos import RegisterAdminDTO
from app.DTOs.auth.dtos import AlunoRegisterResponseDTO
from jose import jwt
from app.DTOs.auth.dtos import AlunoRegisterResponseDTO, ResetPasswordDTO
from app.DTOs.auth.dtos import ServidorRegisterResponseDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from app.database.db import get_session
from fastapi import BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterAlunoDTO
from fastapi import APIRouter
from app.DTOs.auth.dtos import RegisterServidorDTO, LoginUserDTO
from app.controllers.auth_controller import AuthController
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases
from app.middleware.auth_middleware import TokenData, require_student

router = APIRouter()

def get_auth_controller(session: AsyncSession = Depends(get_session)) -> AuthController:
    repo = UserRepository(session)
    return AuthController(repo)

@router.post("/register/staff")
async def register_servidor(
    data: RegisterServidorDTO, 
    session: AsyncSession = Depends(get_session)
):
    repo = UserRepository(session)

    staff = await repo.get_by_email(data.email)
    
    if staff:
       raise ConflictException("Usuário já cadastrado")

    user_created = await repo.create_staff(data)
    response_data = ServidorRegisterResponseDTO.model_validate(user_created)

    return ResponseHandler.created(data=response_data.model_dump(mode='json'))

# Rota unificada de login [Admin, Motorista, Servidor, Aluno]
@router.post("/login")
async def login(
    data: LoginUserDTO,
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.login(data)

    return ResponseHandler.ok(data=result)

@router.post("/recover/password")
async def recover_password(email: str, controller: AuthController = Depends(get_auth_controller)):
    token = await controller.recover_password(email)

    return ResponseHandler.ok(token)

@router.post("/reset/password")
async def reset_password(data: ResetPasswordDTO, token: str, controller: AuthController = Depends(get_auth_controller)):
    await controller.reset_password(token, data)

    return ResponseHandler.no_content()

@router.post("/register/student")
async def register_student(
    data: RegisterAlunoDTO,
    background_tasks: BackgroundTasks,
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.register_student(data, background_tasks)

    return ResponseHandler.created(
        data=result.model_dump(mode="json")
    )

@router.get("/activate/account/student")
async def activate_account(
    token: str,
    session: AsyncSession = Depends(get_session)
):
    service = AuthService(UserRepository(session))

    return await service.activate_account(token)
