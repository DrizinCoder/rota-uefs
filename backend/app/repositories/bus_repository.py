from sqlmodel import col
from app.DTOs.fleet.dtos import BusCreateBatchDTO
from app.DTOs.fleet.dtos import BusCreateDTO
from app.DTOs.fleet.dtos import BusUpdateBatchDTO
from app.DTOs.fleet.dtos import BusUpdateDTO
from typing import List
from sqlalchemy import select, delete
import uuid
from app.database.models import Bus
from sqlalchemy.ext.asyncio import AsyncSession

class BusRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self):
        result = await self.session.execute(select(Bus))
        return result.scalars().all()

    async def get_by_plate(self, plate: str):
        result = await self.session.execute(select(Bus).where(Bus.bus_plate == plate))
        return result.scalar_one_or_none()

    async def delete(self, plate: str):
        bus = await self.get_by_plate(plate)
        if not bus:
            return None
        await self.session.delete(bus)
        await self.session.commit()
        return bus

    async def delete_batch(self, plates: List[str]):
        statement = delete(Bus).where(col(Bus.bus_plate).in_(plates))
        await self.session.execute(statement)
        await self.session.commit()
        return True

    async def patch(self, bus_plate, data: BusUpdateDTO):
        bus = await self.get_by_plate(bus_plate)
        
        if not bus:
            return None

        bus.sqlmodel_update(data.model_dump(exclude_unset=True))
        self.session.add(bus)
        await self.session.commit()
        await self.session.refresh(bus)
        return bus

    async def patch_batch(self, updates: BusUpdateBatchDTO):

        data_to_update = [item.model_dump() for item in updates.updates]
        
        await self.session.run_sync(
            lambda sync_session: sync_session.bulk_update_mappings(
                Bus, 
                data_to_update
            )
        )
        
        await self.session.commit()
        return len(data_to_update)

    async def create(self, data: BusCreateDTO):
        bus = Bus.model_validate(data)
        self.session.add(bus)
        await self.session.commit()
        await self.session.refresh(bus)
        return bus

    async def create_batch(self, buses: BusCreateBatchDTO):
        new_buses = [Bus(**bus.model_dump()) for bus in buses.buses]
        self.session.add_all(new_buses)
        await self.session.commit()
        return len(new_buses)