from fastapi import APIRouter
from app.core.exceptions import NotFoundException
from app.services.email_service import EmailService

router = APIRouter()

@router.get("/error")
async def test_error():
    raise NotFoundException("Erro de teste")

@router.get("/crash")
async def test_crash():
    raise Exception("Erro genérico de teste")

@router.post("/enviar-email")
async def testar_envio_email(email_destino: str):
    email_service = EmailService()
    
    try:
        # Tenta disparar um email simples para o endereço que tu forneceres
        await email_service.send_simple_email(
            subject="Teste de Integração SMTP - Rota UEFS",
            email_to=email_destino,
            body="Olá! Se estás a ler isto, significa que a integração com o Gmail (SMTP) no FastAPI está a funcionar perfeitamente."
        )
        return {"mensagem": f"Email disparado com sucesso para {email_destino}"}
    
    except Exception as e:
        # Se a senha estiver errada ou a porta bloqueada, o erro aparece aqui
        return {"erro": f"Falha ao enviar email: {str(e)}"}