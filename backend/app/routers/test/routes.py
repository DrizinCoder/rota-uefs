from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.exceptions import NotFoundException
from app.services.email.use_cases import EmailUseCases
from app.core.responses import ResponseHandler
from app.middleware.auth_middleware import TokenData, get_current_user, require_student, require_admin

from fastapi import BackgroundTasks

router = APIRouter()

class EmailRequest(BaseModel):
    target_email: str  

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
async def test_student_only(current_user: TokenData = Depends(require_student)):
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
async def test_admin_only(current_user: TokenData = Depends(require_admin)):
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