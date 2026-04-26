from app.enums.enums import RegistrationStatus
import random
from app.core.exceptions import InternalServerException
from sqlmodel import select
from app.models.models import Admin
from app.DTOs.auth import RegisterAdminDTO
from app.DTOs.auth import RegisterMotoristaDTO
from app.DTOs.auth import RegisterAlunoDTO
from app.DTOs.auth import RegisterServidorDTO
from sqlmodel import SQLModel
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select 
from sqlalchemy.orm import defer 
from passlib.context import CryptContext
from app.models.models import User
from app.models.models import Staff
from app.enums.enums import UserProfile, EmploymentType

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_driver(self, data: RegisterMotoristaDTO):
        first_name = data.full_name.split()[0].lower()
        plain_password = f"{first_name}_pass_{random.randint(1000, 9999)}"
        hashed_password = pwd_context.hash(plain_password)
            
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
        return user, plain_password

    async def create_student(self, data: RegisterAlunoDTO):
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

    async def create_staff(self, data: RegisterServidorDTO):
        hashed_password = pwd_context.hash(data.password)
        
        try:
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
            await self.session.flush()

            staff = Staff(
                staff_id=user.user_id,
                employment_type=EmploymentType(data.employment),
                department=data.department
            )
            
            self.session.add(staff)
            await self.session.commit()
            await self.session.refresh(user, ["staff_member"])
            return user
    
        except Exception as e:
            await self.session.rollback()
            raise InternalServerException("Erro ao criar servidor")

    async def create_admin(self, data: RegisterAdminDTO):
        base_name = data.full_name.split()[0].lower()[:20] if data.full_name else "admin"
        plain_password = data.password or f"{base_name}_{random.randint(1000, 9999)}"
        if len(plain_password.encode('utf-8')) > 72:
            plain_password = plain_password[:72]
        hashed_password = pwd_context.hash(plain_password)

        try:
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
            await self.session.flush()
            
            admin = Admin(
                admin_id=user.user_id,
                access_level=data.access_level
            )
            self.session.add(admin)
            
            await self.session.commit()
            await self.session.refresh(user)
            
            return user, admin, plain_password
        
        except Exception as e:
            await self.session.rollback()
            raise InternalServerException("Erro ao criar administrador")

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
        statement = (
            select(
                User.user_id,
                User.full_name,
                User.registration_id,
                User.phone,
                User.email,
                User.profile,
                User.registration_status, 
                Staff.department,
                Staff.employment_type
            )
            .join(Staff, User.user_id == Staff.staff_id)
            .where(
                and_(
                    User.profile == UserProfile.STAFF,
                    User.is_anonymized == False
                )
            )
        )
        result = await self.session.execute(statement)
        return result.mappings().all()
    
    async def list_all_staff_status_peding(self):
        statement = (
            select(
                User.user_id,
                User.full_name,
                User.registration_id,
                User.phone,
                User.email,
                User.profile,
                User.registration_status, 
                Staff.department,
                Staff.employment_type
            )
            .join(Staff, User.user_id == Staff.staff_id)
            .where(
                and_(
                    User.profile == UserProfile.STAFF,
                    User.is_anonymized == False,
                    User.registration_status == "PENDING"
                )
            )
        )
        result = await self.session.execute(statement)
        return result.mappings().all()

    async def list_all_drivers(self):
        statemente = select(User).where(
            and_(
                User.profile == UserProfile.DRIVER,
                User.is_anonymized == False
            )
        )
        result = await self.session.execute(statemente)
        return result.scalars().all()

    async def list_all_admins(self):
        statement = select(User).where(
            and_(
                User.profile == UserProfile.ADMIN,
                User.is_anonymized == False
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def list_all_admins_full(self):
        from sqlalchemy.orm import selectinload
        statement = select(Admin).options(selectinload(Admin.user)).where(
            Admin.admin_id.in_(
                select(User.user_id).where(
                    and_(
                        User.profile == UserProfile.ADMIN,
                        User.is_anonymized == False
                    )
                )
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_admin_full(self, admin_id: uuid.UUID):
        from sqlalchemy.orm import selectinload
        statement = (
            select(Admin)
            .options(selectinload(Admin.user))
            .join(User, Admin.admin_id == User.user_id) 
            .where(
                and_(
                    Admin.admin_id == admin_id,
                    User.is_anonymized == False
                )
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_id(self, user_id: uuid.UUID):
        statement = select(User).where(User.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_id_without_password(self, user_id: uuid.UUID):
        statement = select(User).where(User.user_id == user_id).options(defer(User.password))
        
        result = await self.session.execute(statement)
        return result.scalars().first() 

    async def get_by_registration_id(self, user_id: str):
        statement = select(User).where(User.registration_id == user_id)
        result = await self.session.execute(statement)
        return result.scalars().first()
    
    async def get_by_email(self, email: str):
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_registration(self, registration_id: str):
        from sqlalchemy.orm import selectinload
        statement = (
            select(User)
            .where(User.registration_id == registration_id)
            .options(
                selectinload(User.admin_member),
                selectinload(User.staff_member)
            )
        )
        result = await self.session.execute(statement)
        return result.scalars().first()
    
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

    async def update_status_staff(self, user_id: uuid.UUID, status: bool):
        db_user = await self.get_by_id(user_id)
        if not db_user:
            return None
        
        db_user.registration_status = RegistrationStatus.ACTIVE if status else RegistrationStatus.PENDING
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user