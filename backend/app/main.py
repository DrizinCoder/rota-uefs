import logging

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers.routes import router
from app.database.db import init_db, engine
logger = logging.getLogger("uvicorn")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Iniciando aplicação...")
    await init_db()
    logger.info("✅ Aplicação iniciada...")
    yield
    logger.info("🧱 Encerrando aplicação...")
    await engine.dispose()
    logger.info("🛑 Aplicação encerrada...")

app = FastAPI(lifespan=lifespan)

app.include_router(router)

@app.get("/")
async def health_check():
    return {"message": "Rota UEFS Backend is running"}