import datetime
import uuid

import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock

import app.services.engine.notifications as notifications_module
from app.enums.enums import UserProfile
from app.services.engine.notifications import Notifications


class DummyRepo:
    pass


class DummyBackgroundTasks:
    def __init__(self):
        self.calls = []

    def add_task(self, func, *args, **kwargs):
        self.calls.append((func, args, kwargs))


class DummyEmailUseCases:
    def __init__(self):
        self.calls = []

    def send_boarding_qr_code(self, *args, **kwargs):
        self.calls.append(("boarding", args, kwargs))

    def send_cancellation_confirmation_staff(self, *args, **kwargs):
        self.calls.append(("cancel_staff", args, kwargs))

    def send_cancellation_confirmation_staff_for_extra_name(self, *args, **kwargs):
        self.calls.append(("cancel_staff_extra", args, kwargs))

    def send_reactivation_confirmation_staff(self, *args, **kwargs):
        self.calls.append(("reactivate_staff", args, kwargs))

    def send_reactivation_confirmation_student(self, *args, **kwargs):
        self.calls.append(("reactivate_student", args, kwargs))


@pytest.mark.asyncio
async def test_notifications_subscribe_queues_boarding_qr_code_for_student(monkeypatch):
    dummy_email = DummyEmailUseCases()
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    trip_repo = AsyncMock()
    trip_repo.get_name_route_by_trip_id.return_value = [{"route_name": "Rota Teste"}]

    pushup_repo = AsyncMock()
    pushup_repo.find_all_by_user_id.return_value = []

    notifications = Notifications(DummyRepo(), trip_repo, DummyRepo(), DummyRepo(), pushup_repo)
    user = SimpleNamespace(
        profile=UserProfile.STUDENT,
        email="student@example.com",
        full_name="Test Student",
        registration_id="REG123",
        user_id=uuid.uuid4(),
    )
    trip = SimpleNamespace(
        route=SimpleNamespace(boarding_point="A", drop_off_point="B"),
        trip_id=uuid.uuid4(),
        departure_time=datetime.time(12, 0),
        trip_date="2026-05-16"
    )
    reservation = SimpleNamespace(extra_passenger_name=None, reservation_id=uuid.uuid4())
    tasks = DummyBackgroundTasks()

    await notifications.subscribe_notifications(user, trip, reservation, tasks, 1)

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0].__name__ == "send_boarding_qr_code"


@pytest.mark.asyncio
async def test_notifications_cancel_subscription_schedules_staff_cancellation_for_extra_passenger(monkeypatch):
    dummy_email = DummyEmailUseCases()
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    trip_repo = AsyncMock()
    trip_repo.get_name_route_by_trip_id.return_value = [{"route_name": "Rota Teste"}]

    pushup_repo = AsyncMock()
    pushup_repo.find_all_by_user_id.return_value = []

    notifications = Notifications(DummyRepo(), trip_repo, DummyRepo(), DummyRepo(), pushup_repo)
    user = SimpleNamespace(
        profile=UserProfile.STAFF,
        email="staff@example.com",
        full_name="Staff Test",
        registration_id="SRV123",
        user_id=uuid.uuid4(),
    )
    trip = SimpleNamespace(
        route=SimpleNamespace(boarding_point="A", drop_off_point="B"),
        trip_id=uuid.uuid4(),
        departure_time=datetime.time(12, 0),
        trip_date="2026-05-16"
    )
    reservation = SimpleNamespace(extra_passenger_name="Guest", reservation_id=uuid.uuid4())
    tasks = DummyBackgroundTasks()

    await notifications.cancel_subscription_notifications(user, UserProfile.STAFF, trip, reservation, tasks)

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0].__name__ == "send_cancellation_confirmation_staff_for_extra_name"
