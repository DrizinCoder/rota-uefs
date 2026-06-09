import asyncio, logging

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from sqlmodel import SQLModel
from app.core.config import settings
logger = logging.getLogger("uvicorn")

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    for i in range(10):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
                logger.info("✅ Banco conectado...")
                return
        except Exception as e:
            logger.warning(f"⏳ Tentando conectar ao banco... ({i+1}/10)")
            await asyncio.sleep(2)

    raise Exception("❌ Não conseguiu conectar ao banco")