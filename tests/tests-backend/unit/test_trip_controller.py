import pytest
from types import SimpleNamespace
from app.controllers.trip_controller import TripController


class DummyPriorityEngine:
    async def subscribe_user_to_trip(self, user_id, trip_id, background_tasks, extra_name=None):
        return {"subscribed": True, "trip_id": trip_id}

    async def cancel_subscription(self, user_id, trip_id, background_tasks, extra_name=None):
        return {"cancelled": True, "trip_id": trip_id}


@pytest.mark.asyncio
async def test_trip_controller_subscribe_and_cancel():
    controller = TripController(None, DummyPriorityEngine())
    subscribe_result = await controller.subscriber("user-1", "trip-1", SimpleNamespace(), None)
    assert subscribe_result["subscribed"] is True

    cancel_result = await controller.cancel_subscription("user-1", "trip-1", SimpleNamespace(), None)
    assert cancel_result["cancelled"] is True
