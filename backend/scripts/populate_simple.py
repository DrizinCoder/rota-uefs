import os
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Importações com base na estrutura fornecida
from app.models.models import User, Staff, Admin
from app.enums.enums import UserProfile, AccessLevel, RegistrationStatus, EmploymentType

# Configuração do Hash de Senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/postgres")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def populate_simple():
    print("🚀 Iniciando população simples do banco de dados...")
    
    logs_credentials = {
        "ADMIN": [],
        "STAFF": []
    }
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            
            # 1. CRIAR APENAS UM ADMINISTRADOR
            print("👤 Criando Administrador Padrão...")
            admin_full_name = "Administrador Padrão"
            admin_reg_id = "ADM101"
            admin_email = "admin@uefs.br"
            admin_password_plain = "admin@101"
            
            admin_user = User(
                full_name=admin_full_name,
                password=pwd_context.hash(admin_password_plain),
                registration_id=admin_reg_id,
                phone="75999991001",
                email=admin_email,
                profile=UserProfile.ADMIN,
                registration_status=RegistrationStatus.ACTIVE
            )
            session.add(admin_user)
            await session.flush()
            
            # Correção aqui: extraindo dinamicamente o primeiro nível de acesso do seu Enum
            admin = Admin(
                admin_id=admin_user.user_id, 
                access_level=list(AccessLevel)[0]
            )
            session.add(admin)
            logs_credentials["ADMIN"].append((admin_reg_id, admin_password_plain, admin_full_name))

            # 2. CRIAR APENAS O SERVIDOR GENÉRICO AVULSO
            print("💼 Criando Servidor Genérico...")
            staff_full_name = "Staff Não Registrado"
            staff_reg_id = "STAFF_UNREGISTERED"
            staff_password_plain = "staff_gen_2026"
            
            generic_staff_user = User(
                full_name=staff_full_name,
                password=pwd_context.hash(staff_password_plain),
                registration_id=staff_reg_id,
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
            logs_credentials["STAFF"].append((staff_reg_id, staff_password_plain, f"{staff_full_name} (GENÉRICO)"))

            # Transação única e segura
            await session.commit()

        # --- GERAÇÃO DO ARQUIVO DE LOGS ---
        print("📝 Escrevendo arquivo de logs...")
        os.makedirs("logs", exist_ok=True)
        with open("logs/database_simple.txt", "w", encoding="utf-8") as f:
            f.write(f"==================================================\n")
            f.write(f"   Massa de Testes Simplificada (Apenas ADM + Staff)\n")
            f.write(f"   Data de Geração: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write(f"==================================================\n\n")
            
            for profile, accounts in logs_credentials.items():
                f.write(f"--- CATEGORIA: {profile} ({len(accounts)} conta) ---\n")
                f.write(f"{'Matrícula/ID':<25} | {'Senha':<15} | {'Nome Completo':<35}\n")
                f.write("-" * 80 + "\n")
                for reg_id, pwd, name in accounts:
                    f.write(f"{reg_id:<25} | {pwd:<15} | {name:<35}\n")
                f.write("\n" + "="*50 + "\n\n")

    print("✅ Banco populado com sucesso! Usuários criados e salvos em logs/database_simple.txt.")

if __name__ == "__main__":
    asyncio.run(populate_simple())