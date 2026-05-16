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
