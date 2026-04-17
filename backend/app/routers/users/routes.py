from fastapi import APIRouter

from app.DTOs.users.dtos import UpdateProfileUserDTO, UpdateProfileServidorDTO, UpdateProfileMotoristaDTO
from app.DTOs.operational.dtos import CreateReservaDTO, DeleteReservaDTO

router = APIRouter()

# Perfil do servidor

@router.patch("/update/servidor")
def update_profile(dados: UpdateProfileServidorDTO):
    return {"message": "olá! bem-vindo a update perfil servidor"}

@router.delete("/delete/account/servidor")
def delete_account():
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

# Perfil do motorista

@router.patch("/update/motorista")
def update_profile(dados: UpdateProfileMotoristaDTO):
    return {"message": "olá! bem-vindo a update perfil motorista"}

@router.delete("/delete/account/motorista")
def delete_account(id: str):
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

# Perfil do estudante

@router.patch("/update/estudante")
def update_profile(dados: UpdateProfileUserDTO):
    return {"message": "olá! bem-vindo a update perfil aluno"}

@router.delete("/delete/account/estudante")
def delete_account():
    return {"message": "olá! bem-vindo ao delete perfil estudante"}

# Funcionalidades [Estudante, Servidor, Motorista]

@router.post("/register/reserva")
def update_profile(dados: CreateReservaDTO):
    return {"message": "olá! bem-vindo a create reserva"}


@router.delete("/delete/reserva")
def update_profile(dados: DeleteReservaDTO):
    return {"message": "olá! bem-vindo a delete reserva"}