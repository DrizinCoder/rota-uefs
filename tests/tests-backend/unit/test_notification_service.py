import datetime
import uuid
from types import SimpleNamespace

import pytest
import app.services.engine.notifications as notifications_module
from app.services.engine.notifications import Notifications


class DummyBackgroundTasks:
    def __init__(self):
        self.calls = []

    def add_task(self, func, *args, **kwargs):
        self.calls.append((func, args, kwargs))


class DummyUserRepo:
    async def list_all_admins_full(self):
        return [SimpleNamespace(user=SimpleNamespace(email="admin@example.com", full_name="Admin"))]


@pytest.mark.asyncio
async def test_send_quorum_not_reached_notification_queues_email_tasks(monkeypatch):
    dummy_email = SimpleNamespace(send_quorum_not_reached_notification=lambda *args, **kwargs: None)
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    notifications = Notifications(DummyUserRepo(), None, None, None)
    trip = SimpleNamespace(route=SimpleNamespace(name="Trip A"), trip_id=uuid.uuid4())
    tasks = DummyBackgroundTasks()

    await notifications.send_quorum_not_reached_notification(trip, tasks)

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0] is dummy_email.send_quorum_not_reached_notification
    assert tasks.calls[0][1][0] == "admin@example.com"


@pytest.mark.asyncio
async def test_send_trip_cancelled_adds_email_task(monkeypatch):
    dummy_email = SimpleNamespace(send_trip_cancelled=lambda *args, **kwargs: None)
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    notifications = Notifications(None, None, None, None)
    tasks = DummyBackgroundTasks()
    await notifications.send_trip_cancelled(
        "user@example.com",
        "Test User",
        "trip123",
        datetime.date(2026, 6, 1),
        tasks
    )

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0] is dummy_email.send_trip_cancelled
    assert tasks.calls[0][1][0] == "user@example.com"
