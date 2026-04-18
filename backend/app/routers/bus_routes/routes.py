import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_session
from app.repositories.route_repository import RouteRepository
from app.DTOs.routes.dtos import CreateRouteDTO, UpdateRouteDTO

router = APIRouter(prefix="/routes", tags=["Routes"])

# CREATE 
@router.post("/create")
async def create_route(dados: CreateRouteDTO, session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    route = await repo.create(dados)
    return {"Message": "Route Created", "Route": route}

# READ (GET Todos)
@router.get("/")
async def get_all_routes(session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    routes = await repo.get_all()

    if not routes:
        raise HTTPException(status_code=404, detail="Routes not found")

    return {"Message": "Routes Found", "Routes": routes}

# READ (GET Único)
@router.get("/{id}")
async def get_route(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    route = await repo.get_by_id(id)

    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    return {"Message": "Route Found", "Route": route}

# UPDATE PARCIAL 
@router.patch("/update/{id}")
async def patch_route(id: uuid.UUID, dados: UpdateRouteDTO, session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    updated_route = await repo.patch(id, dados)

    if not updated_route:
        raise HTTPException(status_code=404, detail="Route not found")

    return {"Message": "Route Patched", "Route": updated_route}

# UPDATE COMPLETO
@router.put("/update/{id}")
async def put_route(id: uuid.UUID, dados: CreateRouteDTO, session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    updated_route = await repo.update_full(id, dados)

    if not updated_route:
        raise HTTPException(status_code=404, detail="Route not found")

    return {"Message": "Route Updated", "Route": updated_route}

# DELETE
@router.delete("/delete/{id}")
async def delete_route(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = RouteRepository(session)
    deleted_route = await repo.delete(id)

    if not deleted_route:
        raise HTTPException(status_code=404, detail="Route not found")

    return {"Message": "Route Deleted", "Route": deleted_route}