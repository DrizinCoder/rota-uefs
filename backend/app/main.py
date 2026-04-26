import logging

from fastapi import FastAPI
from contextlib import asynccontextmanager

from fastapi.responses import RedirectResponse
from app.routers.routes import router
from app.database.db import init_db, engine
from app.core.handlers import register_exception_handlers
from app.core.config import settings
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

register_exception_handlers(app)

app.include_router(router)

@app.get("/")
async def health_check():
    return RedirectResponse(url=f"{settings.BASE_URL_FRONTEND}")