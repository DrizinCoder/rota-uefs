import asyncio
from app.database.db import init_db
from app.database.models import User, Staff, Admin, Reservation, Bus

async def main():
    await init_db()
    print("Banco de dados criado com sucesso!")

if __name__ == "__main__":
    asyncio.run(main())