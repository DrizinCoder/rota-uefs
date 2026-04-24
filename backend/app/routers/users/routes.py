import uuid
from app.DTOs.auth.dtos import RegisterServidorDTO
from app.DTOs.users.dtos import CreateSimpleUserDTO
from fastapi import HTTPException
from app.repositories.user_repository import UserRepository
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.responses import ResponseHandler
from app.DTOs.users.dtos import UpdateProfileUserDTO, UpdateProfileServidorDTO
from app.DTOs.operational.dtos import CreateReservaDTO, DeleteReservaDTO
from app.DTOs.users.email_dtos import RequestEmailChangeDTO, ConfirmEmailChangeDTO
from app.controllers.user_controller import UserController
from app.middleware.auth_middleware import TokenData, get_current_user
from fastapi import Request, Query
from fastapi.responses import RedirectResponse
from app.core.config import settings

router = APIRouter()

# Perfil do servidor

@router.get("/servidores")
async def get_all_servidores(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_staff()

    if not users:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    return {"Message": "Staff Found", "Users": users}

@router.patch("/update/{id}/servidor")
async def update_profile(id: uuid.UUID, dados: UpdateProfileServidorDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    updated_user = await repo.patch(id, dados)

    if not updated_user:
        raise NotFoundException("Nenhum servidor encontrado")

    return ResponseHandler.ok(updated_user, "Servidores encontrados")

#  -------- Perfil do motorista ----------------

@router.get("/drivers")
async def get_all_drivers(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_drivers()

    if not users:
        raise HTTPException(status_code=404, detail="Drivers not found")

    return {"Message": "Drivers Found", "Users": users}


@router.patch("/update/{id}/motorista")
async def update_profile(id: uuid.UUID, dados: UpdateProfileUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    updated_user = await repo.patch(id, dados)

    if not updated_user:
        raise HTTPException(status_code=404, detail="Driver not found")

    return {"Message": "Driver Updated", "User": updated_user}

# ----------- Perfil do estudante ------------

@router.get("/estudantes")
async def get_all_estudantes(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_students()

    if not users:
        raise HTTPException(status_code=404, detail="Students not found")

    return {"Message": "Students Found", "Users": users}

@router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(registration_id: str, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    
    user = repo.get_by_registration_id(registration_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "Student Found", "User": user}

@router.patch("/update/{id}/estudante")
async def update_profile(id: uuid.UUID, dados: UpdateProfileUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    updated_user = await repo.patch(id, dados)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    return {"Message": "Student Updated", "User": updated_user}

# Essa rota pode ser usada para deletar qualquer usuário
@router.delete("/delete/account/{id}")
async def delete_account(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    deleted_user = await repo.anonymize(id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "User Deleted", "User": deleted_user} 

@router.post("/create/simple_user")
async def create_simple_user(dados: CreateSimpleUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    user = await repo.create_simple_user(dados)

    if not user:
        raise BadRequestException("Erro ao criar usuário")

    return ResponseHandler.created(user, "Usuário criado com sucesso")

# Funcionalidades [Estudante, Servidor, Motorista]

@router.post("/register/reserva")
def update_profile(dados: CreateReservaDTO):
    return {"message": "olá! bem-vindo a create reserva"}


@router.delete("/delete/reserva")
def update_profile(dados: DeleteReservaDTO):
    return {"message": "olá! bem-vindo a delete reserva"}


# ----------- Funcionalidades de E-mail ------------

def get_user_controller(session: AsyncSession = Depends(get_session)) -> UserController:
    repo = UserRepository(session)
    return UserController(repo)

@router.post("/email-change/request")
async def request_email_change(
    request: Request,
    dados: RequestEmailChangeDTO,
    current_user: TokenData = Depends(get_current_user),
    controller: UserController = Depends(get_user_controller)
):
    # Passamos o host atual para gerar o link (ex: http://localhost:8000)
    base_url = str(request.base_url).rstrip('/')
    
    # current_user.id guarda o UUID do usuário logado que extraímos do Token de Login dele
    user_id = uuid.UUID(current_user.sub)
    
    result = await controller.request_email_change(
        user_id=user_id,
        new_email=dados.new_email,
        base_url=base_url
    )

    return ResponseHandler.ok(data=result)

@router.get("/email-change/confirm")
async def confirm_email_change(
    token: str = Query(..., description="Token de confirmação de mudança de email"),
    controller: UserController = Depends(get_user_controller)
):
    result = await controller.confirm_email_change(token=token)
    return RedirectResponse(url=f"{settings.BASE_URL_FRONTEND}/email-change/confirm", status_code=302)

@router.get("/{id}")
async def get_user(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    user = repo.get_by_id(id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "User Found", "User": user}