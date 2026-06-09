import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException
from app.services.user_service import UserService


def test_get_by_id_without_password_raises_not_found():
    repository = AsyncMock()
    repository.get_by_id_without_password.return_value = None
    service = UserService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_by_id_without_password('00000000-0000-0000-0000-000000000000'))


def test_check_email_available_raises_conflict_when_email_exists():
    repository = AsyncMock()
    repository.get_by_email.return_value = {'email': 'teste@uefs.br'}
    service = UserService(repository)

    with pytest.raises(ConflictException):
        asyncio.run(service.check_email_available('teste@uefs.br'))


def test_update_password_raises_bad_request_when_passwords_do_not_match():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(password='hashed')
    service = UserService(repository)

    with pytest.raises(BadRequestException):
        asyncio.run(service.update_password('00000000-0000-0000-0000-000000000000', SimpleNamespace(password='newpass', confirm_password='otherpass')))


def test_update_phone_raises_not_found_when_missing():
    repository = AsyncMock()
    repository.patch.return_value = None
    service = UserService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.update_phone('00000000-0000-0000-0000-000000000000', SimpleNamespace(phone='+5511999999999')))


def test_update_email_updates_user_when_user_exists():
    repository = AsyncMock()
    user = SimpleNamespace(email='old@test.com')
    repository.get_by_id.return_value = user
    repository.update = AsyncMock()
    service = UserService(repository)

    asyncio.run(service.update_email('00000000-0000-0000-0000-000000000000', 'new@test.com'))

    repository.update.assert_awaited_once()


def test_check_email_available_returns_none_when_email_is_free():
    repository = AsyncMock()
    repository.get_by_email.return_value = None
    service = UserService(repository)

    assert asyncio.run(service.check_email_available('new@test.com')) is None
