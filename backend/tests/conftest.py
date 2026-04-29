import sys
from pathlib import Path

import pytest
from contextlib import asynccontextmanager
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from app.main import app
from app.database.db import get_session

@asynccontextmanager
async def fake_lifespan(app):
    yield

async def override_get_session():
    # Cria os mocks para simular o encadeamento: session.execute().scalars().first()
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_scalars = MagicMock()
    
    # Configura o retorno em cadeia para evitar o erro 'coroutine object has no attribute first'
    mock_session.execute.return_value = mock_result
    mock_result.scalars.return_value = mock_scalars
    
    # Pode retornar None ou um Fake User para simular que o usu�rio foi achado
    mock_scalars.first.return_value = None 
    mock_scalars.all.return_value = []
    
    yield mock_session

@pytest.fixture
def client():
    app.dependency_overrides[get_session] = override_get_session
    
    original_lifespan = app.router.lifespan_context
    app.router.lifespan_context = fake_lifespan
    
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.router.lifespan_context = original_lifespan
        app.dependency_overrides.clear()
