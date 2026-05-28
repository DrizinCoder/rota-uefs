import os
import asyncio
from datetime import date, time, datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.models.models import (
    User, Staff, Admin, Bus, Route, Trip,
    UserProfile, AccessLevel, BusStatus,
    RegistrationStatus, TripStatus, EmploymentType
)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

# Configuração do Hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def populate():
    print("🚀 Iniciando população com correção de senhas...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            async def exists_user(registration_id: str) -> bool:
                res = await session.execute(select(User).where(User.registration_id == registration_id))
                return res.scalar_one_or_none() is not None

            # helper to create user + related model when missing
            async def create_user_if_missing(user_kwargs: dict, related_model=None, related_kwargs: dict | None = None):
                reg = user_kwargs.get("registration_id")
                if await exists_user(reg):
                    print(f"Skipping existing user: {reg}")
                    return None
                u = User(**user_kwargs)
                session.add(u)
                await session.flush()
                if related_model is not None:
                    rel_kwargs = related_kwargs or {}
                    # attach foreign key field names expected by models
                    if related_model is Admin:
                        session.add(Admin(admin_id=u.user_id, **rel_kwargs))
                    elif related_model is Staff:
                        session.add(Staff(staff_id=u.user_id, **rel_kwargs))
                    else:
                        # fallback: try to construct
                        session.add(related_model(**{**rel_kwargs, list(rel_kwargs.keys())[0]: u.user_id}))
                return u

            # 1. ADMIN
            await create_user_if_missing({
                "full_name": "Robson Master",
                "password": pwd_context.hash("admin123"),
                "registration_id": "ADM001",
                "phone": "75988880001",
                "email": "admin@uefs.br",
                "profile": UserProfile.ADMIN,
                "registration_status": RegistrationStatus.ACTIVE
            }, related_model=Admin, related_kwargs={"access_level": AccessLevel.MASTER})

            # 2. PROFESSOR
            await create_user_if_missing({
                "full_name": "Dr. Ricardo",
                "password": pwd_context.hash("prof123"),
                "registration_id": "PR4455",
                "phone": "75988880002",
                "email": "professor@uefs.br",
                "profile": UserProfile.STAFF,
                "registration_status": RegistrationStatus.ACTIVE
            }, related_model=Staff, related_kwargs={"employment_type": EmploymentType.FACULTY, "department": "Tecnologia"})

            # 2.1 STAFF GENÉRICO (Para professores sem registro)
            await create_user_if_missing({
                "full_name": "Staff Não Registrado",
                "password": pwd_context.hash("staff_gen_2026"),
                "registration_id": "STAFF_UNREGISTERED",
                "phone": "00000000000",
                "email": "staff_unregistered@uefs.br",
                "profile": UserProfile.STAFF,
                "registration_status": RegistrationStatus.ACTIVE
            }, related_model=Staff, related_kwargs={"employment_type": EmploymentType.FACULTY, "department": "Geral"})

            # 3. ALUNO
            await create_user_if_missing({
                "full_name": "Maria Aluna",
                "password": pwd_context.hash("aluno123"),
                "registration_id": "202410123",
                "phone": "75988880003",
                "email": "aluno@uefs.br",
                "profile": UserProfile.STUDENT,
                "registration_status": RegistrationStatus.ACTIVE
            })

            await create_user_if_missing({
                "full_name": "Guilherme",
                "password": pwd_context.hash("aluno123"),
                "registration_id": "202310123",
                "phone": "75988880003",
                "email": "aluno2@uefs.br",
                "profile": UserProfile.STUDENT,
                "registration_status": RegistrationStatus.ACTIVE
            })

            # 4. MOTORISTA
            driver_user = await create_user_if_missing({
                "full_name": "Carlos Motorista",
                "password": pwd_context.hash("driver123"),
                "registration_id": "MOT990",
                "phone": "75988880004",
                "email": "carlos@transporte.com",
                "profile": UserProfile.DRIVER,
                "registration_status": RegistrationStatus.ACTIVE
            })

            # 5. INFRA
            # create bus and route only if not exists (simple check by plate/name)
            existing_bus = await session.execute(select(Bus).where(Bus.bus_plate == "UEFS-2026"))
            if existing_bus.scalar_one_or_none() is None:
                bus = Bus(bus_plate="UEFS-2026", capacity=45, bus_status=BusStatus.ACTIVE)
                session.add(bus)
                await session.flush()
            else:
                bus = existing_bus.scalar_one_or_none()

            existing_route = await session.execute(select(Route).where(Route.name == "Terminal -> UEFS"))
            if existing_route.scalar_one_or_none() is None:
                route = Route(name="Terminal -> UEFS", boarding_point="Terminal", drop_off_point="UEFS")
                session.add(route)
                await session.flush()
            else:
                route = existing_route.scalar_one_or_none()

            # 6. VIAGEM: create trip only if not exists for today with same route/driver
            trip_exists = await session.execute(select(Trip).where(Trip.route_id == route.route_id).where(Trip.driver_id == (driver_user.user_id if driver_user else None)).where(Trip.trip_date == date.today()))
            if trip_exists.scalar_one_or_none() is None:
                trip = Trip(
                    bus_license_plate=bus.bus_plate,
                    driver_id=(driver_user.user_id if driver_user else None),
                    route_id=route.route_id,
                    trip_date=date.today(),
                    departure_time=time(hour=18, minute=0),
                    status=TripStatus.CONFIRMED
                )
                session.add(trip)
            await session.commit()

        # LOG
        os.makedirs("logs", exist_ok=True)
        with open("logs/database.txt", "w", encoding="utf-8") as f:
            f.write(f"=== CREDENCIAIS DE TESTE OK ===\n")
            f.write(f"Admin: ADM001 / admin123\n")
            f.write(f"Genérico: STAFF_UNREGISTERED / staff_gen_2026\n")
            f.write(f"Prof: PR4455 / prof123\n")
            f.write(f"Aluno: 202410123 / aluno123\n")
            f.write(f"Motorista: MOT990 / driver123\n")

    print("✅ Banco populado com sucesso!")

if __name__ == "__main__":
    asyncio.run(populate())