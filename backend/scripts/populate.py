import os
import asyncio
import random
import uuid
from datetime import date, time, datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Importações com base na estrutura fornecida
from app.models.models import (
    User, Staff, Admin, Bus, Route, Trip
)
from app.enums.enums import (
    UserProfile, AccessLevel, BusStatus, 
    RegistrationStatus, TripStatus, EmploymentType
)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

# Configuração do Hash de Senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Listas de sementes para dados randômicos realistas
NAMES = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Beatriz", "Gustavo", "Juliana", "Lucas", "Mariana", "Rodrigo", "Camila", "Rafael", "Aline"]
SURNAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Pereira", "Costa", "Carvalho", "Gomes", "Martins", "Ribeiro"]
DEPARTMENTS = ["Tecnologia", "Administração", "Saúde", "Educação", "Geral", "Engenharia", "Humanas"]
ROUTES_SEED = [
    ("Terminal", "UEFS"), ("UEFS", "Terminal"), ("Centro", "UEFS"), ("UEFS", "Centro"),
    ("Norte", "UEFS"), ("UEFS", "Norte"), ("Sul", "UEFS"), ("UEFS", "Sul"),
    ("Estação Central", "UEFS"), ("UEFS", "Estação Central")
]

def generate_random_name():
    return f"{random.choice(NAMES)} {random.choice(SURNAMES)}"

async def populate():
    print("🚀 Iniciando super população do banco de dados (Com Staff Genérico + 10 de cada)...")
    
    # Dicionários/Listas para guardar credenciais para o log
    logs_credentials = {
        "ADMIN": [],
        "STAFF": [],
        "STUDENT": [],
        "DRIVER": []
    }
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            
            # 1. GERAR ADMINS (10)
            print("👤 Criando Administradores...")
            for i in range(1, 11):
                full_name = generate_random_name()
                reg_id = f"ADM{100 + i}"
                email = f"admin{i}@uefs.br"
                password_plain = f"admin@{100 + i}"
                
                user = User(
                    full_name=full_name,
                    password=pwd_context.hash(password_plain),
                    registration_id=reg_id,
                    phone=f"7599999{1000 + i}",
                    email=email,
                    profile=UserProfile.ADMIN,
                    registration_status=RegistrationStatus.ACTIVE
                )
                session.add(user)
                await session.flush()
                
                admin = Admin(
                    admin_id=user.user_id, 
                    access_level=random.choice(list(AccessLevel))
                )
                session.add(admin)
                
                logs_credentials["ADMIN"].append((reg_id, password_plain, full_name))

            # 2. GERAR STAFF / SERVIDORES
            print("💼 Criando Servidores/Staff...")
            
            # 2.1 FIXO: Criando o Servidor Genérico Obrigatório para o Sistema
            generic_staff_user = User(
                full_name="Staff Não Registrado",
                password=pwd_context.hash("staff_gen_2026"),
                registration_id="STAFF_UNREGISTERED", # O ID esperado pelo seu repositório
                phone="00000000000",
                email="staff_unregistered@uefs.br",
                profile=UserProfile.STAFF,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(generic_staff_user)
            await session.flush()
            
            generic_staff = Staff(
                staff_id=generic_staff_user.user_id,
                employment_type=EmploymentType.FACULTY,
                department="Geral"
            )
            session.add(generic_staff)
            logs_credentials["STAFF"].append(("STAFF_UNREGISTERED", "staff_gen_2026", "Staff Não Registrado (GENÉRICO)"))

            # 2.2 DINÂMICOS: +10 Servidores aleatórios
            for i in range(1, 11):
                full_name = generate_random_name()
                reg_id = f"STF{200 + i}"
                email = f"staff{i}@uefs.br"
                password_plain = f"staff@{200 + i}"
                
                user = User(
                    full_name=full_name,
                    password=pwd_context.hash(password_plain),
                    registration_id=reg_id,
                    phone=f"7599999{2000 + i}",
                    email=email,
                    profile=UserProfile.STAFF,
                    registration_status=RegistrationStatus.ACTIVE
                )
                session.add(user)
                await session.flush()
                
                staff = Staff(
                    staff_id=user.user_id,
                    employment_type=random.choice(list(EmploymentType)),
                    department=random.choice(DEPARTMENTS)
                )
                session.add(staff)
                
                logs_credentials["STAFF"].append((reg_id, password_plain, full_name))

            # 3. GERAR ALUNOS (15)
            print("🎓 Criando Alunos...")
            for i in range(1, 16):
                full_name = generate_random_name()
                reg_id = f"202610{100 + i}"
                email = f"aluno{i}@uefs.br"
                password_plain = f"aluno@{100 + i}"
                
                user = User(
                    full_name=full_name,
                    password=pwd_context.hash(password_plain),
                    registration_id=reg_id,
                    phone=f"7599999{3000 + i}",
                    email=email,
                    profile=UserProfile.STUDENT,
                    registration_status=RegistrationStatus.ACTIVE
                )
                session.add(user)
                
                logs_credentials["STUDENT"].append((reg_id, password_plain, full_name))

            # 4. GERAR MOTORISTAS (10)
            print("🚌 Criando Motoristas...")
            drivers_ids = []
            for i in range(1, 11):
                full_name = generate_random_name()
                reg_id = f"MOT{400 + i}"
                email = f"motorista{i}@transporte.com"
                password_plain = f"motorista@{400 + i}"
                
                user = User(
                    full_name=full_name,
                    password=pwd_context.hash(password_plain),
                    registration_id=reg_id,
                    phone=f"7599999{4000 + i}",
                    email=email,
                    profile=UserProfile.DRIVER,
                    registration_status=RegistrationStatus.ACTIVE
                )
                session.add(user)
                await session.flush()
                drivers_ids.append(user.user_id)
                
                logs_credentials["DRIVER"].append((reg_id, password_plain, full_name))

            # 5. GERAR ÔNIBUS (10)
            print("🚍 Criando Frota de Ônibus...")
            bus_plates = []
            for i in range(1, 11):
                plate = f"UEFS-20{i:02d}"
                bus = Bus(
                    bus_plate=plate,
                    capacity=random.choice([42, 45, 50]),
                    bus_status=random.choice(list(BusStatus))
                )
                session.add(bus)
                bus_plates.append(plate)

            # 6. GERAR ROTAS (10)
            print("🗺️ Criando Rotas...")
            routes_ids = []
            for i, (boarding, drop) in enumerate(ROUTES_SEED, start=1):
                route = Route(
                    name=f"Rota {i:02d}: {boarding} ➔ {drop}",
                    boarding_point=boarding,
                    drop_off_point=drop
                )
                session.add(route)
                await session.flush()
                routes_ids.append(route.route_id)

            # 7. GERAR VIAGENS (15)
            print("📅 Agendando Viagens...")
            await session.flush()
            
            for i in range(1, 16):
                trip_date = date.today() + timedelta(days=random.randint(0, 3))
                departure_time = time(hour=random.choice([6, 7, 12, 13, 18, 22]), minute=random.choice([0, 15, 30]))
                
                trip = Trip(
                    bus_license_plate=random.choice(bus_plates),
                    driver_id=random.choice(drivers_ids),
                    route_id=random.choice(routes_ids),
                    trip_date=trip_date,
                    departure_time=departure_time,
                    status=random.choice(list(TripStatus))
                )
                session.add(trip)

            # Transação única e segura
            await session.commit()

        # --- GERAÇÃO DO ARQUIVO DE LOGS ---
        print("📝 Escrevendo arquivo de logs...")
        os.makedirs("logs", exist_ok=True)
        with open("logs/database.txt", "w", encoding="utf-8") as f:
            f.write(f"==================================================\n")
            f.write(f"   Massa de Testes Gerada Automaticamente         \n")
            f.write(f"   Data de Geração: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write(f"==================================================\n\n")
            
            for profile, accounts in logs_credentials.items():
                f.write(f"--- CATEGORIA: {profile} ({len(accounts)} contas) ---\n")
                f.write(f"{'Matrícula/ID':<25} | {'Senha':<15} | {'Nome Completo':<35}\n")
                f.write("-" * 80 + "\n")
                for reg_id, pwd, name in accounts:
                    f.write(f"{reg_id:<25} | {pwd:<15} | {name:<35}\n")
                f.write("\n" + "="*50 + "\n\n")

    print("✅ Banco populado com sucesso! O ID 'STAFF_UNREGISTERED' está pronto para uso.")

if __name__ == "__main__":
    asyncio.run(populate())