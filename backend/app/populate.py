import os
import asyncio
from datetime import date, time, datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.models.models import (
    User, Staff, Admin, Bus, Route, Trip, Reservation,
    UserProfile, AccessLevel, BoardingStatus, BusStatus, 
    RegistrationStatus, TripStatus, EmploymentType
)

# Configuração do Hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def populate():
    print("🚀 Iniciando população com correção de senhas...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            # 1. ADMIN
            admin_user = User(
                full_name="Robson Master",
                password=pwd_context.hash("admin123"), # HASH DIRETO AQUI
                registration_id="ADM-001",
                phone="75988880001",
                email="admin@uefs.br",
                profile=UserProfile.ADMIN,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(admin_user)
            await session.flush()
            session.add(Admin(admin_id=admin_user.user_id, access_level=AccessLevel.MASTER))

            # 2. PROFESSOR
            prof_user = User(
                full_name="Dr. Ricardo",
                password=pwd_context.hash("prof123"),
                registration_id="PR-4455",
                phone="75988880002",
                email="professor@uefs.br",
                profile=UserProfile.STAFF,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(prof_user)
            await session.flush()
            session.add(Staff(staff_id=prof_user.user_id, employment_type=EmploymentType.FACULTY, department="Tecnologia"))

            # 3. ALUNO
            student_user = User(
                full_name="Maria Aluna",
                password=pwd_context.hash("aluno123"),
                registration_id="202410123",
                phone="75988880003",
                email="aluno@uefs.br",
                profile=UserProfile.STUDENT,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(student_user)
            await session.flush()

            # 4. MOTORISTA
            driver_user = User(
                full_name="Carlos Motorista",
                password=pwd_context.hash("driver123"),
                registration_id="MOT-990",
                phone="75988880004",
                email="carlos@transporte.com",
                profile=UserProfile.DRIVER,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(driver_user)
            await session.flush()

            # 5. INFRA
            bus = Bus(bus_plate="UEFS-2026", capacity=45, bus_status=BusStatus.ACTIVE)
            route = Route(name="Terminal -> UEFS", boarding_point="Terminal", drop_off_point="UEFS")
            session.add_all([bus, route])
            await session.flush()

            # 6. VIAGEM
            trip = Trip(
                bus_license_plate=bus.bus_plate,
                driver_id=driver_user.user_id,
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
            f.write(f"Admin: ADM-001 / admin123\n")
            f.write(f"Prof: PR-4455 / prof123\n")
            f.write(f"Aluno: 202410123 / aluno123\n")
            f.write(f"Motorista: MOT-990 / driver123\n")

    print("✅ Banco populado com sucesso!")

if __name__ == "__main__":
    asyncio.run(populate())