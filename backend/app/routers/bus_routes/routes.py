from app.core.responses import ResponseHandler
from backend.app.services.route_service import RouteService
from app.middleware import require_admin
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.repositories.route_repository import RouteRepository
from app.DTOs.routes import CreateRouteDTO, UpdateRouteDTO

router = APIRouter(
    prefix="/routes", tags=["Routes"],
    dependencies=[Depends(require_admin)]
)

async def get_route_service(session: AsyncSession = Depends(get_session)) -> RouteService:
    repo = RouteRepository(session)
    return RouteService(repo)


@router.post("/create")
async def create_route(dados: CreateRouteDTO, service: RouteService = Depends(get_route_service)):
    result = await service.create(dados)
    return ResponseHandler.created(result)

@router.get("/")
async def get_all_routes(service: RouteService = Depends(get_route_service)):
    result = await service.get_all()
    return ResponseHandler.ok(result)

@router.get("/{id}")
async def get_route(id: uuid.UUID, service: RouteService = Depends(get_route_service)):
    result = await service.get_by_id(id)
    return ResponseHandler.ok(result)

@router.patch("/update/{id}")
async def patch_route(id: uuid.UUID, dados: UpdateRouteDTO, service: RouteService = Depends(get_route_service)):
    result = await service.patch(id, dados)
    return ResponseHandler.ok(result)

@router.put("/update/{id}")
async def put_route(id: uuid.UUID, dados: CreateRouteDTO, service: RouteService = Depends(get_route_service)):
    result = await service.update_full(id, dados)
    return ResponseHandler.ok(result)

@router.delete("/delete/{id}")
async def delete_route(id: uuid.UUID, service: RouteService = Depends(get_route_service)):
    result = await service.delete(id)
    return ResponseHandler.ok(result)