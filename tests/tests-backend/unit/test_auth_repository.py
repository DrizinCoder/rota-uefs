import asyncio
from unittest.mock import AsyncMock, MagicMock

from app.repositories.user_repository import UserRepository


def test_get_by_email_returns_expected_user():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()
    scalars.first.return_value = {'email': 'teste@uefs.br'}
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = UserRepository(session)
    user = asyncio.run(repository.get_by_email('teste@uefs.br'))

    assert user == {'email': 'teste@uefs.br'}
    session.execute.assert_called_once()


def test_get_by_registration_id_returns_expected_user():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()
    scalars.first.return_value = {'registration_id': '20240001'}
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = UserRepository(session)
    user = asyncio.run(repository.get_by_registration_id('20240001'))

    assert user == {'registration_id': '20240001'}
    session.execute.assert_called_once()


def test_anonymize_returns_none_when_user_not_found():
    repository = UserRepository(AsyncMock())
    repository.get_by_id = AsyncMock(return_value=None)

    result = asyncio.run(repository.anonymize('00000000-0000-0000-0000-000000000000'))

    assert result is None
