import datetime
import uuid

import pytest
from types import SimpleNamespace

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

    async def send_cancellation_confirmation_student(self, *args, **kwargs):
        self.calls.append(("cancel_student", args, kwargs))


@pytest.mark.asyncio
async def test_notifications_schedule_background_tasks(monkeypatch):
    dummy_email = DummyEmailUseCases()
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    notifications = Notifications(DummyRepo(), DummyRepo(), DummyRepo(), DummyRepo())
    user = SimpleNamespace(
        profile=UserProfile.STUDENT,
        email="student@example.com",
        full_name="Test Student",
        registration_id="REG123"
    )
    trip = SimpleNamespace(
        route=SimpleNamespace(boarding_point="A", drop_off_point="B"),
        trip_id=uuid.uuid4(),
        departure_time=datetime.time(12, 0),
        trip_date="2026-05-16"
    )
    reservation = SimpleNamespace(extra_passenger_name=None, reservation_id=uuid.uuid4())
    tasks = DummyBackgroundTasks()

    await notifications.subscribe_notifications(user, trip, reservation, tasks)
    assert len(tasks.calls) == 1
    assert tasks.calls[0][0].__name__ == "send_boarding_qr_code"

    await notifications.cancel_subscription_notifications(user, trip, reservation, tasks)
    assert len(tasks.calls) == 2
