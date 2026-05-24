import uuid

import pytest

from app.main import app
from app.routers.users.dependencies import get_trip_controller


class FakeTripController:
    def __init__(self):
        self._subscriptions = {}
        self._reservations = {}

    async def subscriber(self, user_id: str, trip_id: str, background_tasks, extra_name: str = None):
        reservation_id = str(uuid.uuid4())
        subscription = {
            "reservation_id": reservation_id,
            "trip_id": trip_id,
            "user_id": user_id,
            "extra_passenger_name": extra_name,
        }
        self._subscriptions.setdefault(trip_id, []).append(subscription)
        self._reservations[reservation_id] = subscription

        return {
            "message": "subscribed",
            "reservation_id": reservation_id,
            "trip_id": trip_id,
            "user_id": user_id,
            "extra_passenger_name": extra_name,
        }

    async def get_subscribers(self, trip_id: str, background_tasks):
        return self._subscriptions.get(trip_id, [])

    async def cancel_subscription(self, profile, reservation_id: str, background_tasks, extra_passenger_name: str = None):
        subscription = self._reservations.pop(reservation_id, None)
        if subscription:
            trip_id = subscription["trip_id"]
            self._subscriptions[trip_id] = [
                item for item in self._subscriptions.get(trip_id, [])
                if item["reservation_id"] != reservation_id
            ]
            return {
                "message": "canceled",
                "reservation_id": reservation_id,
                "trip_id": trip_id,
                "user_id": subscription["user_id"],
            }

        return {"message": "not found", "reservation_id": reservation_id}


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

    reservation_id = subscribe_data["reservation_id"]
    cancel_response = auth_student_client.post(
        f"/users/reservation/{reservation_id}/cancel",
        json={}
    )
    assert cancel_response.status_code == 200
    cancel_data = cancel_response.json()
    assert cancel_data["message"] == "canceled"
    assert cancel_data["trip_id"] == trip_id

    subscribers_after_cancel = auth_student_client.get(f"/users/trip/{trip_id}/subscribers")
    assert subscribers_after_cancel.status_code == 200
    assert subscribers_after_cancel.json() == []
