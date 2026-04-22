from fastapi import APIRouter
from app.core.exceptions import NotFoundException
from app.services.email.use_cases import EmailUseCases
from app.core.responses import ResponseHandler

from fastapi import BackgroundTasks

router = APIRouter()

@router.get("/error")
async def test_error():
    raise NotFoundException("Erro de teste")

@router.get("/crash")
async def test_crash():
    raise Exception("Erro genérico de teste")


@router.post("/enviar-email")
async def testar_envio_email(email_destino: str, background_tasks: BackgroundTasks):
    email_use_case = EmailUseCases()

    background_tasks.add_task(
        email_use_case.send_welcome,
        email_destino,
        "João",
        "https://rota-uefs.com/login"
    )

    return ResponseHandler.accepted("Email está sendo enviado em background")