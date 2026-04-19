from app.DTOs.auth.dtos import RegisterAlunoDTO
from sqlmodel import SQLModel
from app.DTOs.users.dtos import CreateSimpleUserDTO
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select 
from passlib.context import CryptContext
from app.models.models import User
from app.enums.enums import UserProfile

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_user(self, data: RegisterAlunoDTO):
        hashed_password = pwd_context.hash(data.password)
        
        user = User(
            full_name=data.full_name,
            password=hashed_password,
            registration_id=data.registration_id,
            phone=data.phone,
            email=data.email,
            profile=data.profile,
            registration_status=data.registration_status
        )
        
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def list_all_students(self):
        statement = select(User).where(
                and_(
                User.profile == UserProfile.STUDENT,
                User.is_anonymized == False
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().all()
    
    async def list_all_staff(self):
        statement = select(User).where(
            and_(
                User.profile == UserProfile.STAFF,
                User.is_anonymized == False
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def list_all_drivers(self):
        statemente = select(User).where(
            and_(
                User.profile == UserProfile.DRIVER,
                User.is_anonymized == False
            )
        )
        result = await self.session.execute(statemente)
        return result.scalars().all()

    async def get_by_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_registration_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.registration_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()
    
    async def get_by_email(self, email: str):
        statement = select(User).where(User.email == email)
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

    async def anonymize(self, user_id: uuid.UUID):
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None

        db_user.full_name = "Usuário Anonimizado"
        db_user.email = f"deleted_{user_id}@system.local"
        db_user.phone = "00000000000"
        db_user.is_anonymized = True
        db_user.password = ""
        db_user.registration_id = f"anon_{user_id}"
        
        self.session.add(db_user)
        await self.session.commit()
        return db_user