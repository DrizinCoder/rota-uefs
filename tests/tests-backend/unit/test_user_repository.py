import asyncio
from unittest.mock import AsyncMock, MagicMock

from app.repositories.user_repository import UserRepository


def test_get_by_id_returns_user():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()
    scalars.first.return_value = {'user_id': '123'}
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = UserRepository(session)
    user = asyncio.run(repository.get_by_id('123'))

    assert user == {'user_id': '123'}


def test_patch_returns_none_when_user_missing():
    session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    session.execute.return_value = mock_result

    repository = UserRepository(session)
    result = asyncio.run(repository.patch('00000000-0000-0000-0000-000000000000', MagicMock()))

    assert result is None
