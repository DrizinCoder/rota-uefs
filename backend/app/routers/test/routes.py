from asyncio.log import logger
# 1. IMPORTAÇÃO CORRETA E LIMPA
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from app.core.exceptions import NotFoundException
from app.services.email.use_cases import EmailUseCases
from app.core.responses import ResponseHandler
from app.middleware.auth_middleware import TokenData, get_current_user, require_student, require_admin
from app.core.scheduler import task_scheduler
from app.core.config import settings

router = APIRouter()

class EmailRequest(BaseModel):
    target_email: str  

def schedule_function_test(menssage: str = "Olá, mundo!", executor: str = "Sistema"):
    # Corrigido aqui também para usar datetime.now() direto
    logger.info(f"💥 [JOB EXECUTED] O alarme tocou! Mensagem recebida: {menssage} | Executor: {executor} | Horário de execução: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

@router.get("/schedule")
async def schedule_test_endpoint():
    """
    Endpoint de teste que agenda uma tarefa para daqui a exatamente 1 minuto.
    """
    # 2. CHAMADA CORRIGIDA (Sem o .datetime duplicado)
    agora = datetime.now() 
    
    # Se agora é 23h20, a viagem simulada será às 23h22 (daqui a 2 minutos)
    tempo_viagem_teste = agora + timedelta(minutes=2)
    
    # 3. CHAMADA DO SEU SCHEDULER ADAPTADA À NOVA ORDEM
    # Passamos os textos do *args direto e o minutes_notice nomeado no final
    job = task_scheduler.schedule_task(
        schedule_function_test,                # func
        tempo_viagem_teste,                    # date / travel_date
        "Testando o novo agendador com UUID!", # *args[0] -> vai para 'menssage'
        "Robson",                              # *args[1] -> vai para 'executor'
        minutes_notice=1                       # 👈 Definido explicitamente como 1 minuto!
    )
    
    if not job:
        return ResponseHandler.error(
            message="Não foi possível agendar, o tempo de disparo calculado já passou.",
            status_code=400
        )
        
    # Calculando o momento exato do disparo (23h22 - 1 minuto = 23h21)
    momento_disparo = tempo_viagem_teste - timedelta(minutes=1)

    return ResponseHandler.ok(
        data={
            "job_id": job.id,  
            "horario_do_disparo": momento_disparo.strftime('%d/%m/%Y %H:%M:%S'),
        },
        message="Tarefa registrada no SQLite. Rodará em 1 minuto!"
    )
    
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