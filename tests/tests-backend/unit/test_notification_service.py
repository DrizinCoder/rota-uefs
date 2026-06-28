import datetime
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
import app.services.engine.notifications as notifications_module
from app.services.engine.notifications import Notifications


@pytest.mark.asyncio
async def test_send_quorum_not_reached_notification_queues_email_tasks(monkeypatch, dummy_background_tasks, dummy_user_repo, dummy_notification_email_use_cases):
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_notification_email_use_cases)

    trip_repo = AsyncMock()
    trip_repo.get_name_route_by_trip_id.return_value = [{"route_name": "Trip A"}]

    pushup_repo = AsyncMock()
    pushup_repo.find_all_by_user_id.return_value = []

    notifications = Notifications(dummy_user_repo, trip_repo, None, None, pushup_repo)
    trip = SimpleNamespace(route=SimpleNamespace(name="Trip A"), trip_id=uuid.uuid4())
    tasks = dummy_background_tasks

    await notifications.send_quorum_not_reached_notification(trip, tasks)

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0].__self__ is dummy_notification_email_use_cases
    assert tasks.calls[0][0].__func__ is dummy_notification_email_use_cases.send_quorum_not_reached_notification.__func__
    assert tasks.calls[0][1][0] == "admin@example.com"


@pytest.mark.asyncio
async def test_send_trip_cancelled_adds_email_task(monkeypatch, dummy_background_tasks):
    dummy_email = SimpleNamespace(send_trip_cancelled=lambda *args, **kwargs: None)
    monkeypatch.setattr(notifications_module, "EmailUseCases", lambda *args, **kwargs: dummy_email)

    pushup_repo = AsyncMock()
    pushup_repo.find_all_by_user_id.return_value = []

    notifications = Notifications(None, None, None, None, pushup_repo)
    tasks = dummy_background_tasks

    user = SimpleNamespace(
        email="user@example.com",
        full_name="Test User",
        user_id=uuid.uuid4(),
    )
    trip = SimpleNamespace(
        route=SimpleNamespace(name="trip123"),
        trip_id=uuid.uuid4(),
        trip_date=datetime.date(2026, 6, 1),
    )

    await notifications.send_trip_cancelled(user, trip, tasks)

    assert len(tasks.calls) == 1
    assert tasks.calls[0][0] is dummy_email.send_trip_cancelled
    assert tasks.calls[0][1][0] == "user@example.com"
