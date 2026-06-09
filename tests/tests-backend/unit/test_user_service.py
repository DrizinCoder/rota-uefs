import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException
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


def test_update_email_successfully_updates_user_email():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(email='old@test.com')
    repository.update = AsyncMock()
    service = UserService(repository)

    asyncio.run(service.update_email('00000000-0000-0000-0000-000000000000', 'new@test.com'))

    repository.update.assert_awaited_once()
    repository.get_by_id.assert_awaited_once()


def test_update_email_raises_not_found_when_user_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = UserService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.update_email('00000000-0000-0000-0000-000000000000', 'new@test.com'))


def test_update_password_raises_bad_request_when_passwords_differ():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(password='hash')
    service = UserService(repository)

    with pytest.raises(BadRequestException):
        asyncio.run(service.update_password('00000000-0000-0000-0000-000000000000', SimpleNamespace(password='abc12345', confirm_password='xyz12345')))


def test_update_password_raises_unprocessable_entity_when_password_is_same_as_old(monkeypatch):
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(password='hash')
    monkeypatch.setattr('app.services.user_service.pwd_context.verify', lambda password, hashed: True)
    service = UserService(repository)

    with pytest.raises(UnprocessableEntityException):
        asyncio.run(service.update_password('00000000-0000-0000-0000-000000000000', SimpleNamespace(password='samepass', confirm_password='samepass')))


def test_update_phone_returns_updated_user():
    repository = AsyncMock()
    repository.patch.return_value = {'phone': '55555555'}
    service = UserService(repository)

    updated = asyncio.run(service.update_phone('00000000-0000-0000-0000-000000000000', SimpleNamespace(phone='55555555')))

    assert updated == {'phone': '55555555'}
    repository.patch.assert_awaited_once()


def test_delete_account_raises_not_found_when_user_missing():
    repository = AsyncMock()
    repository.anonymize.return_value = None
    service = UserService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.delete_account('00000000-0000-0000-0000-000000000000'))


def test_list_students_returns_students():
    repository = AsyncMock()
    repository.list_all_students.return_value = [{'user_id': '1'}]
    service = UserService(repository)

    students = asyncio.run(service.list_students())

    assert students == [{'user_id': '1'}]


def test_get_student_by_registration_returns_user():
    repository = AsyncMock()
    repository.get_by_registration_id.return_value = {'registration_id': '20240001'}
    service = UserService(repository)

    student = asyncio.run(service.get_student_by_registration('20240001'))

    assert student == {'registration_id': '20240001'}
