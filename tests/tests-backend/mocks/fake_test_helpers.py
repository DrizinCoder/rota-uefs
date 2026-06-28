from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock


class FakeDashboardController:
    async def trip_report(self, trip_id, file_format):
        return f"report-{trip_id}-{file_format}"

    async def monthly_report(self, month, file_format):
        return f"monthly-{month}-{file_format}"


class FakePushSubscriptionService:
    def __init__(self):
        self.send_to_user = AsyncMock()


class FakeEmailUseCases:
    def __init__(self):
        self.send_welcome = MagicMock()


class DummyNotificationEmailUseCases:
    def send_quorum_not_reached_notification(self, *args, **kwargs):
        return None

    def send_trip_cancelled(self, *args, **kwargs):
        return None


class DummyBackgroundTasks:
    def __init__(self):
        self.calls = []

    def add_task(self, func, *args, **kwargs):
        self.calls.append((func, args, kwargs))


class DummyUserRepo:
    async def list_all_admins_full(self):
        return [SimpleNamespace(admin_id="admin-001", user=SimpleNamespace(email="admin@example.com", full_name="Admin"))]


class DummyReservationRepository:
    def __init__(self, reservation):
        self.reservation = reservation
        self.updated = False

    async def get_by_id(self, reservation_id):
        return self.reservation

    async def update_boarding(self, reservation):
        self.updated = True


class DummyPriorityEngine:
    def __init__(self, valid_ids):
        self.valid_ids = valid_ids

    async def get_valid_reservation(self, trip_id):
        return [SimpleNamespace(reservation_id=r) for r in self.valid_ids]


class DummyHTML:
    def __init__(self, string):
        self.string = string

    def write_pdf(self):
        return b"%PDF-1.4"
