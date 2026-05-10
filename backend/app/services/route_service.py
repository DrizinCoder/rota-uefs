import uuid
from app.core.exceptions import NotFoundException
from app.repositories.route_repository import RouteRepository
from app.DTOs.routes import CreateRouteDTO, UpdateRouteDTO
import logging

logger = logging.getLogger(__name__)


class RouteService:
    def __init__(self, repository: RouteRepository):
        self.repository = repository

    async def create(self, dados: CreateRouteDTO):
        logger.info(f"Route creation requested | Name: {dados.name}")

        route = await self.repository.create(dados)

        logger.info(f"Route created successfully | Route ID: {route.route_id}")
        return route.model_dump(mode='json')

    async def get_all(self):
        logger.info("Route list requested")

        routes = await self.repository.get_all()
        if not routes:
            raise NotFoundException("Routes not found")

        logger.info(f"Route list retrieved successfully | Count: {len(routes)}")
        return [route.model_dump(mode='json') for route in routes]

    async def get_by_id(self, id: uuid.UUID):
        logger.info(f"Route lookup requested | Route ID: {id}")

        route = await self.repository.get_by_id(id)
        if not route:
            raise NotFoundException("Route not found")

        logger.info(f"Route retrieved successfully | Route ID: {id}")
        return route.model_dump(mode='json')

    async def patch(self, id: uuid.UUID, dados: UpdateRouteDTO):
        logger.info(f"Route patch requested | Route ID: {id}")

        route = await self.repository.patch(id, dados)
        if not route:
            raise NotFoundException("Route not found")

        logger.info(f"Route patched successfully | Route ID: {id}")
        return route.model_dump(mode='json')

    async def update_full(self, id: uuid.UUID, dados: CreateRouteDTO):
        logger.info(f"Route full update requested | Route ID: {id}")

        route = await self.repository.update_full(id, dados)
        if not route:
            raise NotFoundException("Route not found")

        logger.info(f"Route fully updated successfully | Route ID: {id}")
        return route.model_dump(mode='json')

    async def delete(self, id: uuid.UUID):
        logger.info(f"Route deletion requested | Route ID: {id}")

        route = await self.repository.delete(id)
        if not route:
            raise NotFoundException("Route not found")

        logger.info(f"Route deleted successfully | Route ID: {id}")
        return route.model_dump(mode='json')