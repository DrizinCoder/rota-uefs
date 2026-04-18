import uuid
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Route
from app.DTOs.routes.dtos import CreateRouteDTO, UpdateRouteDTO
from dataclasses import asdict

class RouteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self):
        statement = select(Route)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_id(self, route_id: uuid.UUID):
        statement = select(Route).where(Route.route_id == route_id)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def create(self, route_dto: CreateRouteDTO):
        route_model = Route(**asdict(route_dto)) 
        self.session.add(route_model)
        await self.session.commit()
        await self.session.refresh(route_model)
        return route_model

    async def update_full(self, route_id: uuid.UUID, route_dto: CreateRouteDTO):
        db_route = await self.get_by_id(route_id)
        if not db_route:
            return None
        
        update_dict = asdict(route_dto)
        db_route.sqlmodel_update(update_dict)
        
        self.session.add(db_route)
        await self.session.commit()
        await self.session.refresh(db_route)
        return db_route

    async def patch(self, route_id: uuid.UUID, update_data: UpdateRouteDTO):
        db_route = await self.get_by_id(route_id)
        if not db_route:
            return None

        update_dict = {k: v for k, v in asdict(update_data).items() if v is not None}
        db_route.sqlmodel_update(update_dict)

        self.session.add(db_route)
        await self.session.commit()
        await self.session.refresh(db_route)
        return db_route

    async def delete(self, route_id: uuid.UUID):
        db_route = await self.get_by_id(route_id)
        if not db_route:
            return None
        
        await self.session.delete(db_route)
        await self.session.commit()
        return db_route