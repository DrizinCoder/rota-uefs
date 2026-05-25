import asyncio
from app.database.db import init_db, engine, get_session
from sqlalchemy.ext.asyncio import AsyncSession


def test_db_module_exports_session_functions():
    assert callable(init_db)
    assert hasattr(engine, "dispose")
    assert callable(get_session)


def test_get_session_returns_async_session():
    async def run_session():
        session_generator = get_session()
        session = await session_generator.__anext__()
        assert isinstance(session, AsyncSession)
        await session.close()
    asyncio.run(run_session())
