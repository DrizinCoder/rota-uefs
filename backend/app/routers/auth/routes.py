from app.DTOs.auth import ResetPasswordDTO
from app.DTOs.auth import ServidorRegisterResponseDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from app.database.db import get_session
from fastapi import BackgroundTasks, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth import RegisterAlunoDTO
from fastapi import APIRouter
from app.DTOs.auth import RegisterServidorDTO, LoginUserDTO
from app.controllers.auth_controller import AuthController
from app.services.auth_service import AuthService

router = APIRouter()

def get_auth_controller(session: AsyncSession = Depends(get_session)) -> AuthController:
    repo = UserRepository(session)
    return AuthController(repo)

@router.post("/register/staff")
async def register_servidor(
    data: RegisterServidorDTO, 
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.register_staff(data)

    return ResponseHandler.created(
        data=result.model_dump(mode='json')
    )

# Rota unificada de login [Admin, Motorista, Servidor, Aluno]
@router.post("/login")
async def login(
    data: LoginUserDTO,
    response: Response,
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.login(data)

    response = ResponseHandler.ok(data=result, message="Login realizado com sucesso")

    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=False,  
        samesite="lax",
        max_age=3600   
    )

    response.set_cookie(
        key="refresh_token",
        value=result["refresh_token"],
        httponly=True,
        secure=False, 
        samesite="strict",
        path="/auth/refresh", 
        max_age=604800 
    )

    return response

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


@router.post("/activate/account/student")
async def activate_account(
    token: str,
    controller: AuthController = Depends(get_auth_controller)
):
    result = await controller.activate_account(token)

    return ResponseHandler.ok(
        data=result, 
        message="Conta ativada com sucesso. Bem-vindo!"
    )