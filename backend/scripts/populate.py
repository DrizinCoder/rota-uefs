import os
import asyncio
import uuid
from datetime import date, time, datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.models.models import (
    User, Staff, Admin, Bus, Route, Trip, Reservation,
    UserProfile, AccessLevel, BusStatus, 
    RegistrationStatus, TripStatus, EmploymentType,
    PassengerType, BoardingStatus
)

# Configuração do Hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def populate():
    print("🚀 Iniciando população com múltiplos alunos, viagens e reservas...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            # 1. ADMIN
            admin_user = User(
                full_name="Robson Master",
                password=pwd_context.hash("admin123"),
                registration_id="ADM001",
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
                registration_id="PR4455",
                phone="75988880002",
                email="professor@uefs.br",
                profile=UserProfile.STAFF,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(prof_user)
            await session.flush()
            session.add(Staff(staff_id=prof_user.user_id, employment_type=EmploymentType.FACULTY, department="Tecnologia"))

            # 2.1 STAFF GENÉRICO (Para professores sem registro)
            staff_unregistered_user = User(
                full_name="Staff Não Registrado",
                password=pwd_context.hash("staff_gen_2026"),
                registration_id="STAFF_UNREGISTERED",
                phone="00000000000",
                email="staff_unregistered@uefs.br",
                profile=UserProfile.STAFF,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(staff_unregistered_user)
            await session.flush()
            session.add(Staff(
                staff_id=staff_unregistered_user.user_id, 
                employment_type=EmploymentType.FACULTY, 
                department="Geral"
            ))

            # 3. ALUNOS (15 alunos)
            students = []
            student_names = [
                "Maria Aluna", "João Silva", "Ana Costa", "Pedro Oliveira",
                "Carla Santos", "Bruno Ferreira", "Lucia Mendes", "Felipe Rocha",
                "Beatriz Lima", "Gabriel Sousa", "Fernanda Gomes", "Lucas Ribeiro",
                "Isabela Martins", "Diego Alves", "Camila Nunes"
            ]
            
            for i, name in enumerate(student_names):
                student = User(
                    full_name=name,
                    password=pwd_context.hash("aluno123"),
                    registration_id=f"202410{100+i}",
                    phone=f"75988880{100+i:03d}",
                    email=f"aluno{i}@uefs.br",
                    profile=UserProfile.STUDENT,
                    registration_status=RegistrationStatus.ACTIVE
                )
                session.add(student)
                await session.flush()
                students.append(student)

            # 4. MOTORISTA
            driver_user = User(
                full_name="Carlos Motorista",
                password=pwd_context.hash("driver123"),
                registration_id="MOT990",
                phone="75988880004",
                email="carlos@transporte.com",
                profile=UserProfile.DRIVER,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(driver_user)
            await session.flush()

            # 5. INFRA (Ônibus e Rotas)
            bus = Bus(bus_plate="UEFS-2026", capacity=45, bus_status=BusStatus.ACTIVE)
            route = Route(name="Terminal -> UEFS", boarding_point="Terminal", drop_off_point="UEFS")
            session.add_all([bus, route])
            await session.flush()

            # 6. 10 VIAGENS
            trips = []
            routes_list = [
                ("Terminal -> UEFS", "Terminal", "UEFS"),
                ("UEFS -> Centro", "UEFS", "Centro"),
                ("Terminal -> Feira", "Terminal", "Feira de Santana"),
                ("Centro -> UEFS", "Centro", "UEFS"),
                ("Feira -> Terminal", "Feira de Santana", "Terminal"),
                ("UEFS -> Terminal", "UEFS", "Terminal"),
                ("Centro -> Feira", "Centro", "Feira de Santana"),
                ("Terminal -> Centro", "Terminal", "Centro"),
                ("Feira -> UEFS", "Feira de Santana", "UEFS"),
                ("UEFS -> Centro (Volta)", "UEFS", "Centro")
            ]

            for i, (route_name, boarding, drop) in enumerate(routes_list):
                # Criar rota se necessário
                trip_route = Route(
                    name=route_name,
                    boarding_point=boarding,
                    drop_off_point=drop
                )
                session.add(trip_route)
                await session.flush()

                # Criar viagem
                trip_date = date.today() + timedelta(days=i)
                trip_time = time(hour=18 + (i % 6), minute=0)
                
                trip = Trip(
                    bus_license_plate=bus.bus_plate,
                    driver_id=driver_user.user_id,
                    route_id=trip_route.route_id,
                    trip_date=trip_date,
                    departure_time=trip_time,
                    status=TripStatus.CONFIRMED
                )
                session.add(trip)
                await session.flush()
                trips.append(trip)

            # 7. RESERVAS: Cada aluno em cada viagem
            print(f"📝 Criando {len(students)} x {len(trips)} = {len(students) * len(trips)} reservas...")
            x = 0
            y = 0
            for student in students:
                x = x + 1
                for trip in trips:
                    y = y + 1
                    if x <= y:
                        bc = BoardingStatus.BOARDED
                    else:
                        bc = BoardingStatus.NOT_BOARDED
                    confirmation_code = f"CONF-{student.user_id.hex[:8]}-{trip.trip_id.hex[:8]}"
                    reservation = Reservation(
                        user_id=student.user_id,
                        trip_id=trip.trip_id,
                        passenger_type=PassengerType.HOLDER,
                        boarding_confirmation=bc,
                        confirmation_code=confirmation_code
                    )
                    session.add(reservation)
                y = 0
            await session.commit()

        # LOG
        os.makedirs("logs", exist_ok=True)
        with open("logs/database.txt", "w", encoding="utf-8") as f:
            f.write(f"=== CREDENCIAIS DE TESTE E DADOS POPULADOS ===\n\n")
            f.write(f"ADMIN:\n")
            f.write(f"  Matrícula: ADM001\n")
            f.write(f"  Senha: admin123\n\n")
            f.write(f"GENÉRICO STAFF:\n")
            f.write(f"  Matrícula: STAFF_UNREGISTERED\n")
            f.write(f"  Senha: staff_gen_2026\n\n")
            f.write(f"PROFESSOR:\n")
            f.write(f"  Matrícula: PR4455\n")
            f.write(f"  Senha: prof123\n\n")
            f.write(f"MOTORISTA:\n")
            f.write(f"  Matrícula: MOT990\n")
            f.write(f"  Senha: driver123\n\n")
            f.write(f"ALUNOS (15 total):\n")
            f.write(f"  Senha: aluno123 (todos)\n")
            f.write(f"  Matrículas: 2024100100 até 2024100114\n\n")
            f.write(f"DADOS CRIADOS:\n")
            f.write(f"  ✅ 15 Alunos\n")
            f.write(f"  ✅ 10 Viagens\n")
            f.write(f"  ✅ 150 Reservas (15 alunos × 10 viagens)\n")

    print("✅ Banco populado com sucesso!")
    print(f"📊 Resumo: 15 alunos | 10 viagens | 150 reservas")


if __name__ == "__main__":
    asyncio.run(populate())