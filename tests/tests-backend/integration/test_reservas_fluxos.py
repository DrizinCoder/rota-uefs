import uuid

import pytest

from app.main import app
from app.routers.users.dependencies import get_trip_controller


class FakeTripController:
    def __init__(self):
        self._subscriptions = {}

    async def subscriber(self, user_id: str, trip_id: str, background_tasks, extra_name: str = None):
        self._subscriptions.setdefault(trip_id, []).append(
            {
                "user_id": user_id,
                "extra_passenger_name": extra_name,
            }
        )
        return {
            "message": "subscribed",
            "trip_id": trip_id,
            "user_id": user_id,
            "extra_passenger_name": extra_name,
        }

    async def get_subscribers(self, trip_id: str):
        return self._subscriptions.get(trip_id, [])

    async def cancel_subscription(self, user_id: str, trip_id: str, background_tasks, extra_passenger_name: str = None):
        subscriptions = self._subscriptions.get(trip_id, [])
        self._subscriptions[trip_id] = [
            item for item in subscriptions
            if not (item["user_id"] == user_id and item["extra_passenger_name"] == extra_passenger_name)
        ]
        return {
            "message": "canceled",
            "trip_id": trip_id,
            "user_id": user_id,
        }


@pytest.fixture(autouse=True)
def override_trip_controller():
    fake_controller = FakeTripController()
    app.dependency_overrides[get_trip_controller] = lambda: fake_controller
    yield fake_controller
    app.dependency_overrides.pop(get_trip_controller, None)


def test_reservation_flow_subscribe_and_cancel(auth_student_client):
    trip_id = str(uuid.uuid4())

    subscribe_response = auth_student_client.post(
        f"/users/trip/{trip_id}/subscribe",
        json={}
    )

    assert subscribe_response.status_code == 200
    subscribe_data = subscribe_response.json()
    assert subscribe_data["message"] == "subscribed"
    assert subscribe_data["trip_id"] == trip_id

    subscribers_response = auth_student_client.get(f"/users/trip/{trip_id}/subscribers")
    assert subscribers_response.status_code == 200
    subscribers_data = subscribers_response.json()
    assert isinstance(subscribers_data, list)
    assert len(subscribers_data) == 1
    assert subscribers_data[0]["user_id"] == subscribe_data["user_id"]

    cancel_response = auth_student_client.post(
        f"/users/trip/{trip_id}/cancel",
        json={}
    )
    assert cancel_response.status_code == 200
    cancel_data = cancel_response.json()
    assert cancel_data["message"] == "canceled"
    assert cancel_data["trip_id"] == trip_id

    subscribers_after_cancel = auth_student_client.get(f"/users/trip/{trip_id}/subscribers")
    assert subscribers_after_cancel.status_code == 200
    assert subscribers_after_cancel.json() == []
