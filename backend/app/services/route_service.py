import uuid
from app.core.exceptions import NotFoundException
from app.repositories.route_repository import RouteRepository
from app.DTOs.routes import CreateRouteDTO, UpdateRouteDTO

class RouteService:
    def __init__(self, repository: RouteRepository):
        self.repository = repository

    async def create(self, dados: CreateRouteDTO):
        return await self.repository.create(dados)

    async def get_all(self):
        routes = await self.repository.get_all()
        if not routes:
            raise NotFoundException("Routes not found")
        return routes

    async def get_by_id(self, id: uuid.UUID):
        route = await self.repository.get_by_id(id)
        if not route:
            raise NotFoundException("Route not found")
        return route

    async def patch(self, id: uuid.UUID, dados: UpdateRouteDTO):
        route = await self.repository.patch(id, dados)
        if not route:
            raise NotFoundException("Route not found")
        return route

    async def update_full(self, id: uuid.UUID, dados: CreateRouteDTO):
        route = await self.repository.update_full(id, dados)
        if not route:
            raise NotFoundException("Route not found")
        return route

    async def delete(self, id: uuid.UUID):
        route = await self.repository.delete(id)
        if not route:
            raise NotFoundException("Route not found")
        return route