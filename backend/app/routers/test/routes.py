from fastapi import APIRouter, Depends
from app.core.exceptions import NotFoundException
from app.middleware import get_current_user, require_student, require_admin, TokenData

router = APIRouter()


@router.get("/verify-token")
async def test_verify_token(current_user: TokenData = Depends(get_current_user)):
    return {
        "success": True,
        "message": "Token válido!",
        "data": {
            "sub": current_user.id,
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
            "sub": current_user.id,
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
            "sub": current_user.id,
            "profile": current_user.profile,
            "access_level": current_user.access_level
        }
    }


@router.get("/error")
async def test_error():
    raise NotFoundException("Erro de teste")