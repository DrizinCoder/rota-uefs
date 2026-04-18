from sqlmodel import SQLModel
from app.database.enums import UserProfile
from app.DTOs.users.dtos import CreateSimpleUserDTO
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models import User

class UserRepository:

    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def list_all_students(self):
        statement = select(User).where(User.profile == UserProfile.STUDENT)
        result = await self.session.execute(statement)
        return result.scalars().all()
    
    async def list_all_staff(self):
        statement = select(User).where(User.profile == UserProfile.STAFF)
        result = await self.session.execute(statement)
        return result.scalars().all()()

    async def get_by_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_registration_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.registration_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()
    
    async def create_simple_user(self, user_dto: CreateSimpleUserDTO):
        user_model = User.model_validate(user_dto)
        self.session.add(user_model)
        await self.session.commit()
        await self.session.refresh(user_model)
        return user_model
    
    async def update(self, user: User):
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
    async def patch(self, user_id: uuid.UUID, update_data: SQLModel):
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)

        db_user.sqlmodel_update(update_dict)

        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def delete(self, user_id: uuid.UUID):
        user = await self.get_by_id(user_id)
        if not user:
            return None
        await self.session.delete(user)
        await self.session.commit()
        return user