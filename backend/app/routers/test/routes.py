from app.enums.enums import UserProfile
import asyncio
from asyncio.log import logger

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from app.core.exceptions import NotFoundException
from app.services.email.use_cases import EmailUseCases
from app.core.responses import ResponseHandler
from app.middleware.auth_middleware import TokenData, get_current_user, require_profile
from app.core.scheduler import task_scheduler




from app.services.push_notification.web_push_service import PushSubscriptionService
from app.routers.users.dependencies import get_push_subscription_service
from app.repositories.user_repository import UserRepository
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

class EmailRequest(BaseModel):
    target_email: str  
  
@router.post("/enviar-push")
async def testar_envio_push(
    current_user: TokenData = Depends(get_current_user),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    await service.send_to_user(
        user_id=current_user.sub,
        title="Notificação de Teste",
        body="Se você recebeu isso, as notificações estão funcionando!"
    )
    return ResponseHandler.ok("Notificação de teste enviada")

@router.get("/enviar-push-publico")
async def testar_envio_push_publico(
    registration_id: str,
    session: AsyncSession = Depends(get_session),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    user_repo = UserRepository(session)
    user = await user_repo.get_by_registration_id(registration_id)
    
    if not user:
        raise NotFoundException("Usuário não encontrado")

    await service.send_to_user(
        user_id=user.user_id,
        title="Teste Público",
        body=f"Olá {user.full_name}, teste sem autenticação funcionando!"
    )
    return ResponseHandler.ok(f"Notificação enviada para {user.full_name}")

@router.get("/verify-token")
async def test_verify_token(current_user: TokenData = Depends(get_current_user)):
    return {
        "success": True,
        "message": "Token válido!",
        "data": {
            "sub": current_user.sub,
            "registration_id": current_user.registration_id,
            "email": current_user.email,
            "profile": current_user.profile,
            "full_name": current_user.full_name,
            "access_level": current_user.access_level,
            "driver_id": current_user.driver_id,
            "staff_id": current_user.staff_id,
            "student_id": current_user.student_id,
            "department": current_user.department,
            "employment_type": current_user.employment_type
        }
    }

@router.get("/student-only")
async def test_student_only(current_user: TokenData = Depends(require_profile(UserProfile.STUDENT))):
    return {
        "success": True,
        "message": "Acesso permitido! Você é um aluno.",
        "data": {
            "sub": current_user.sub,
            "profile": current_user.profile,
            "student_id": current_user.student_id
        }
    }

@router.get("/admin-only")
async def test_admin_only(current_user: TokenData = Depends(require_profile(UserProfile.ADMIN))):
    return {
        "success": True,
        "message": "Acesso permitido! Você é um administrador.",
        "data": {
            "sub": current_user.sub,
            "profile": current_user.profile,
            "access_level": current_user.access_level
        }
    }

@router.get("/error")
async def test_error():
    raise NotFoundException("Erro de teste")

@router.get("/crash")
async def test_crash():
    raise Exception("Erro genérico de teste")

@router.post("/enviar-email")
async def testar_envio_email(
    request: EmailRequest, 
    background_tasks: BackgroundTasks
):
    email_use_case = EmailUseCases()

    background_tasks.add_task(
        email_use_case.send_welcome,
        request.target_email,
        "João",
        "https://rota-uefs.com/login"
    )

    print(f"Processando envio para: {request.target_email}")

    return ResponseHandler.accepted("Email está sendo enviado em background")