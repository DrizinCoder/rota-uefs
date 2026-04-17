import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models import User

class UserRepository:

    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def list_all(self):
        statement = select(User)
        result = await self.session.execute(statement)
        return result.scalars().all()
    
    async def get_by_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_registration_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.registration_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()
    
    async def create(self, user: User):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
    async def update(self, user: User):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
    async def patch(self, user_id: int, update_data: dict):
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(db_user, key, value)

        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def delete(self, user: User):
        await self.session.delete(user)
        await self.session.commit()
        return user