import uuid
from sqlmodel import select
from sqlalchemy import update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Route
from app.DTOs.routes import CreateRouteDTO, UpdateRouteDTO

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
        route_model = Route(**route_dto.model_dump()) 
        self.session.add(route_model)
        await self.session.commit()
        await self.session.refresh(route_model)
        return route_model

    async def update_full(self, route_id: uuid.UUID, route_dto: CreateRouteDTO):
        db_route = await self.get_by_id(route_id)
        if not db_route:
            return None
        
        update_dict = route_dto.model_dump()
        db_route.sqlmodel_update(update_dict)
        
        self.session.add(db_route)
        await self.session.commit()
        await self.session.refresh(db_route)
        return db_route

    async def patch(self, route_id: uuid.UUID, update_data: UpdateRouteDTO):
        update_dict = update_data.model_dump(exclude_none=True)

        stmt = (
            update(Route)
            .where(Route.route_id == route_id)
            .values(**update_dict)
            .returning(Route)
        )

        result = await self.session.execute(stmt)

        await self.session.commit()

        return result.scalar_one_or_none()

    async def delete(self, route_id: uuid.UUID):
        stmt = (
            delete(Route)
            .where(Route.route_id == route_id)
        )

        result = await self.session.execute(stmt)

        await self.session.commit()

        return result.rowcount > 0