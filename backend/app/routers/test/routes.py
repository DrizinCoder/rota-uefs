from fastapi import APIRouter
from app.core.exceptions import NotFoundException

router = APIRouter()

@router.get("/error")
async def test_error():
    raise NotFoundException("Erro de teste")

@router.get("/crash")
async def test_crash():
    raise Exception("Erro genérico de teste")