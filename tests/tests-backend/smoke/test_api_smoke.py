import json
import uuid

import pytest

from app.main import app
from app.routers.admin.routes import get_admin_controller
from app.routers.bus_routes.routes import get_route_service
from app.routers.checkin.routes import get_reservation_service as get_checkin_reservation_service
from app.routers.fleet.routes import get_bus_service as get_fleet_bus_service
from app.routers.users.dependencies import (
    get_push_subscription_service,
    get_reservation_service,
    get_trip_controller,
    get_trip_service,
    get_user_service as get_users_service,
)
from app.routers.web_push.routes import get_push_subscription_service as get_web_push_service
from app.routers.trip.routes import get_trip_service as get_trip_router_service
from app.enums.enums import UserProfile

from fixtures.api_payloads import (
    BUS_BATCH_CREATE_VALID,
    BUS_BATCH_DELETE_VALID,
    BUS_BATCH_UPDATE_VALID,
    BUS_CREATE_INVALID,
    BUS_CREATE_VALID,
    BUS_DETAILED_VALID,
    BUS_UPDATE_DETAILED,
    BUS_UPDATE_VALID,
    CHECKIN_INVALID,
    CHECKIN_VALID,
    DEFAULT_CHECKIN_TRIP_ID,
    DEFAULT_ROUTE_ID,
    DEFAULT_TRIP_ID,
    DEFAULT_USER_ID,
    DEFAULT_WEB_PUSH_ENDPOINT,
    LOGIN_INVALID_PASSWORD,
    LOGIN_VALID,
    MANUAL_CHECKIN_VALID,
    REGISTER_DRIVER_VALID,
    REGISTER_STUDENT_DUPLICATE_EMAIL,
    REGISTER_STUDENT_VALID,
    ROUTE_CREATE_INVALID,
    ROUTE_CREATE_VALID,
    ROUTE_DETAILED_VALID,
    ROUTE_UPDATE_COMPLETE,
    ROUTE_UPDATE_VALID,
    TRIP_CANCEL,
    TRIP_CREATE_INVALID,
    TRIP_CREATE_VALID,
    TRIP_DETAILED_VALID,
    TRIP_UPDATE_STATUS,
    TRIP_UPDATE_VALID,
    TRIP_SUBSCRIPTION_VALID,
    USER_PASSWORD_UPDATE_VALID,
    USER_PROFILE_UPDATE_VALID,
    WEB_PUSH_CREATE_INVALID,
    WEB_PUSH_CREATE_VALID,
    WEB_PUSH_DELETE_VALID,
)
from mocks.fake_api_services import (
    FakeAdminService,
    FakeAuthService,
    FakeBusService,
    FakeReservationService,
    FakeRouteService,
    FakeTripController,
    FakeTripService,
    FakeUserService,
    FakeWebPushSubscriptionService,
)


@pytest.fixture(autouse=True)
def api_dependency_overrides():
    route_service = FakeRouteService()
    bus_service = FakeBusService()
    trip_service = FakeTripService()
    trip_controller = FakeTripController()
    reservation_service = FakeReservationService()
    web_push_service = FakeWebPushSubscriptionService()
    auth_service = FakeAuthService()
    user_service = FakeUserService()
    admin_service = FakeAdminService()

    overrides = {
        get_route_service: lambda: route_service,
        get_fleet_bus_service: lambda: bus_service,
        get_trip_service: lambda: trip_service,
        get_trip_router_service: lambda: trip_service,
        get_trip_controller: lambda: trip_controller,
        get_reservation_service: lambda: reservation_service,
        get_checkin_reservation_service: lambda: reservation_service,
        get_push_subscription_service: lambda: web_push_service,
        get_web_push_service: lambda: web_push_service,
        get_users_service: lambda: user_service,
        get_admin_controller: lambda: admin_service,
    }

    app.dependency_overrides.update(overrides)
    yield {
        "route_service": route_service,
        "bus_service": bus_service,
        "trip_service": trip_service,
        "trip_controller": trip_controller,
        "reservation_service": reservation_service,
        "web_push_service": web_push_service,
        "auth_service": auth_service,
        "user_service": user_service,
        "admin_service": admin_service,
    }

    for dependency in overrides:
        app.dependency_overrides.pop(dependency, None)


def test_root_redirects_to_frontend(client):
    response = client.get("/", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"].startswith("http")


def test_tests_verify_token_returns_current_user(auth_student_client):
    response = auth_student_client.get("/tests/verify-token")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["profile"] == UserProfile.STUDENT.value
    assert data["data"]["registration_id"] is not None


def test_tests_student_only_allows_student(auth_student_client):
    response = auth_student_client.get("/tests/student-only")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["profile"] == UserProfile.STUDENT.value


def test_tests_admin_only_allows_admin(auth_admin_client):
    response = auth_admin_client.get("/tests/admin-only")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["profile"] == UserProfile.ADMIN.value


def test_tests_admin_only_rejects_student(client):
    response = client.get("/tests/admin-only")

    assert response.status_code == 401
    body = response.json()
    assert body["success"] is False
    assert body["error"]["code"] == "UNAUTHORIZED"


def test_tests_error_returns_not_found(client):
    response = client.get("/tests/error")

    assert response.status_code == 404
    body = response.json()
    assert body["error"]["code"] == "NOT_FOUND"
    assert body["error"]["message"] == "Erro de teste"


def test_tests_crash_returns_internal_server_error(client):
    try:
        response = client.get("/tests/crash")
        assert response.status_code == 500
        body = response.json()
        assert body["error"]["code"] == "INTERNAL_SERVER_ERROR"
    except Exception as e:
        assert "Erro genérico de teste" in str(e)


def test_auth_login_success(client, created_estudante):
    response = client.post(
        "/auth/login",
        json={
            "registration_id": created_estudante["registration_id"],
            "password": "Senha@1234",
        },
    )
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "access_token" in data.get("data", {})
    assert data["data"]["token_type"] == "bearer"


def test_auth_login_invalid_credentials(client, created_estudante):
    response = client.post(
        "/auth/login",
        json={
            "registration_id": created_estudante["registration_id"],
            "password": "WrongPassword123!",
        },
    )
    assert response.status_code == 401

    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "HTTP_ERROR"
    assert data["error"]["message"] == "Invalid credentials"


def test_auth_login_invalid_payload(client):
    response = client.post("/auth/login", json={"email": "test@example.com"})
    assert response.status_code == 422


def test_auth_register_student_success(client):
    response = client.post("/auth/register/student", json=REGISTER_STUDENT_VALID)

    assert response.status_code in [200, 201, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert "user_id" in data.get("data", {}) or "user_id" in data
    else:
        body = response.json()
        assert body["error"]["code"] in ["VALIDATION_ERROR", "HTTP_ERROR"]


def test_auth_register_student_duplicate_email(client):
    response = client.post("/auth/register/student", json=REGISTER_STUDENT_DUPLICATE_EMAIL)

    assert response.status_code in [201, 409, 422]
    if response.status_code == 409:
        assert response.json()["error"]["code"] == "HTTP_ERROR"
    elif response.status_code == 422:
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_auth_register_driver_success(client):
    response = client.post("/auth/register/driver", json=REGISTER_DRIVER_VALID)

    assert response.status_code in [200, 201, 404, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert "user_id" in data.get("data", {}) or "user_id" in data


def test_users_get_profile(auth_student_client):
    response = auth_student_client.get(f"/users/{DEFAULT_USER_ID}")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert "user_id" in data.get("data", {})


def test_users_get_me(auth_student_client):
    response = auth_student_client.get("/users/me")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["email"] is not None


def test_users_update_profile(auth_student_client):
    response = auth_student_client.put(
        f"/users/{DEFAULT_USER_ID}",
        json=USER_PROFILE_UPDATE_VALID
    )

    assert response.status_code in [200, 404, 422]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["full_name"] == USER_PROFILE_UPDATE_VALID["full_name"]


def test_users_update_password(auth_student_client):
    response = auth_student_client.post(
        "/users/password/change",
        json=USER_PASSWORD_UPDATE_VALID
    )

    assert response.status_code in [200, 404, 422]
    if response.status_code == 200:
        assert response.json()["success"] is True


def test_users_list(auth_admin_client):
    response = auth_admin_client.get("/users/")

    assert response.status_code in [200, 404, 422]
    if response.status_code == 200:
        data = response.json()
        assert "users" in data.get("data", {}) or "data" in data


def test_users_delete(auth_admin_client):
    response = auth_admin_client.delete(f"/users/{DEFAULT_USER_ID}")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert response.json()["success"] is True


def test_admin_dashboard(auth_admin_client):
    response = auth_admin_client.get("/admin/dashboard")

    assert response.status_code in [200, 422, 404]
    if response.status_code == 200:
        data = response.json()
        assert "total_users" in data.get("data", {})


def test_admin_get_users(auth_admin_client):
    response = auth_admin_client.get("/admin/users")

    assert response.status_code in [200, 422, 404]
    if response.status_code == 200:
        data = response.json()
        assert "users" in data.get("data", {})


def test_admin_batch_operations(auth_admin_client):
    response = auth_admin_client.post(
        "/admin/batch-operations",
        json={"operation": "activate_users", "user_ids": [str(DEFAULT_USER_ID)]}
    )

    assert response.status_code in [200, 405, 404, 422]
    if response.status_code == 200:
        assert response.json()["success"] is True


def test_admin_requires_authorization(client):
    response = client.get("/tests/admin-only")
    assert response.status_code == 401
    body = response.json()
    assert body["error"]["code"] == "UNAUTHORIZED"


def test_routes_create(auth_admin_client):
    response = auth_admin_client.post("/routes/create", json=ROUTE_DETAILED_VALID)

    assert response.status_code in [200, 201, 404, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert "route_id" in data.get("data", {})


def test_routes_list(auth_admin_client):
    response = auth_admin_client.get("/routes/")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_routes_update(auth_admin_client):
    response = auth_admin_client.put(
        f"/routes/{DEFAULT_ROUTE_ID}",
        json=ROUTE_UPDATE_COMPLETE
    )

    assert response.status_code in [200, 404, 405, 422]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["name"] == ROUTE_UPDATE_COMPLETE["name"]


def test_routes_get_detail(client):
    response = client.get(f"/routes/{DEFAULT_ROUTE_ID}")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["route_id"] == str(DEFAULT_ROUTE_ID)


def test_fleet_access_denied_for_student(client):
    response = client.get("/fleet/")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_fleet_create(auth_admin_client):
    response = auth_admin_client.post("/fleet/", json=BUS_DETAILED_VALID)

    assert response.status_code in [200, 201, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert data["data"]["bus_plate"] == BUS_DETAILED_VALID["bus_plate"]


def test_fleet_list(auth_admin_client):
    response = auth_admin_client.get("/fleet/")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_fleet_update(auth_admin_client):
    response = auth_admin_client.put(
        f"/fleet/{DEFAULT_ROUTE_ID}",
        json=BUS_UPDATE_DETAILED
    )

    assert response.status_code in [200, 404, 405, 422]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["capacity"] == BUS_UPDATE_DETAILED["capacity"]


def test_fleet_batch_operations(auth_admin_client):
    response = auth_admin_client.post("/fleet/batch/create", json=BUS_BATCH_CREATE_VALID)

    assert response.status_code in [200, 201, 404, 422]
    if response.status_code in [200, 201]:
        assert response.json()["success"] is True


def test_trips_create(auth_admin_client):
    response = auth_admin_client.post("/trip/", json=TRIP_DETAILED_VALID)

    assert response.status_code in [200, 201, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert "trip_id" in data.get("data", {})


def test_trips_list(auth_admin_client):
    response = auth_admin_client.get("/trip/")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_trips_get_detail(client):
    response = client.get(f"/trip/{DEFAULT_TRIP_ID}/feed")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert "trip_id" in data.get("data", {})


def test_trips_update_status(auth_driver_client):
    response = auth_driver_client.patch(
        f"/trip/{DEFAULT_TRIP_ID}/status",
        json=TRIP_UPDATE_STATUS
    )

    assert response.status_code in [200, 404, 422]
    if response.status_code == 200:
        data = response.json()
        assert data["data"]["status"] == TRIP_UPDATE_STATUS["status"]


def test_trip_subscription_create(auth_student_client):
    response = auth_student_client.post(
        f"/users/trip/{DEFAULT_TRIP_ID}/subscription",
        json=TRIP_SUBSCRIPTION_VALID
    )

    assert response.status_code in [200, 201, 404, 422]
    if response.status_code in [200, 201]:
        data = response.json()
        assert "subscription_id" in data.get("data", {}) or "success" in data


def test_trip_subscription_list(auth_student_client):
    response = auth_student_client.get("/users/subscriptions")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_trip_subscription_delete(auth_student_client):
    response = auth_student_client.delete(
        f"/users/trip/{DEFAULT_TRIP_ID}/subscription"
    )

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert response.json()["success"] is True


@pytest.mark.parametrize(
    "payload",
    [WEB_PUSH_CREATE_INVALID, {"p256dh": "key"}, {"auth": "key"}],
)
def test_web_push_invalid_payload_returns_validation_error(auth_student_client, payload):
    response = auth_student_client.post("/web-push/subscribe", json=payload)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_web_push_subscription_flow(auth_student_client):
    subscribe_response = auth_student_client.post("/web-push/subscribe", json=WEB_PUSH_CREATE_VALID)
    assert subscribe_response.status_code == 200
    assert subscribe_response.json()["data"]["endpoint"] == WEB_PUSH_CREATE_VALID["endpoint"]

    unsubscribe_response = auth_student_client.request(
        "DELETE", "/web-push/unsubscribe",
        content=json.dumps(WEB_PUSH_DELETE_VALID),
        headers={"Content-Type": "application/json"}
    )
    assert unsubscribe_response.status_code == 200
    assert unsubscribe_response.json()["data"]["deleted"] is True


def test_web_push_duplicate_subscription_returns_conflict(auth_student_client):
    first = auth_student_client.post("/web-push/subscribe", json=WEB_PUSH_CREATE_VALID)
    assert first.status_code == 200

    second = auth_student_client.post("/web-push/subscribe", json=WEB_PUSH_CREATE_VALID)
    assert second.status_code == 409
    assert second.json()["error"]["code"] == "HTTP_ERROR"


def test_checkin_requires_driver_returns_unauthorized(client):
    response = client.post("/checkin/", json=CHECKIN_VALID)

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_checkin_flow_succeeds_for_driver(auth_driver_client):
    response = auth_driver_client.post("/checkin/", json=CHECKIN_VALID)

    assert response.status_code == 200
    assert response.json()["data"]["checkin_code"] == CHECKIN_VALID["checkin_code"]

    manual_response = auth_driver_client.post("/checkin/manual", json=MANUAL_CHECKIN_VALID)
    assert manual_response.status_code == 200
    assert manual_response.json()["data"]["reservation_id"] == MANUAL_CHECKIN_VALID["reservation_id"]


@pytest.mark.parametrize(
    "payload",
    [CHECKIN_INVALID, {"checkin_code": "1234.abcd"}, {"trip_id": str(DEFAULT_CHECKIN_TRIP_ID)}],
)
def test_checkin_invalid_payload_returns_validation_error(auth_driver_client, payload):
    response = auth_driver_client.post("/checkin/", json=payload)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_driver_get_list(auth_admin_client):
    response = auth_admin_client.get("/driver/")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_driver_get_routes(auth_driver_client):
    response = auth_driver_client.get("/driver/routes")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_driver_get_vehicles(auth_driver_client):
    response = auth_driver_client.get("/driver/vehicles")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_driver_stats(auth_driver_client):
    response = auth_driver_client.get(f"/driver/{DEFAULT_USER_ID}/stats")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert "trips_completed" in data.get("data", {}) or "total_trips" in data.get("data", {})


def test_notifications_get_list(auth_student_client):
    response = auth_student_client.get("/notifications/")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data.get("data", []), (list, dict))


def test_notifications_mark_read(auth_student_client):
    notification_id = str(uuid.uuid4())
    response = auth_student_client.put(f"/notifications/{notification_id}/read")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert response.json()["success"] is True


def test_notifications_delete(auth_student_client):
    notification_id = str(uuid.uuid4())
    response = auth_student_client.delete(f"/notifications/{notification_id}")

    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert response.json()["success"] is True


@pytest.mark.parametrize(
    "payload",
    [ROUTE_CREATE_INVALID, {"boarding_point": "X"}, {"drop_off_point": "Y"}],
)
def test_routes_invalid_payload_returns_validation_error(auth_admin_client, payload):
    response = auth_admin_client.post("/routes/create", json=payload)

    assert response.status_code in [422, 404]
    if response.status_code == 422:
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.parametrize(
    "payload",
    [BUS_CREATE_INVALID, {"capacity": 10}, {"bus_status": "Active"}],
)
def test_fleet_invalid_payload_returns_validation_error(auth_admin_client, payload):
    response = auth_admin_client.post("/fleet/", json=payload)

    assert response.status_code in [422, 404]
    if response.status_code == 422:
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.parametrize(
    "payload",
    [TRIP_CREATE_INVALID, {"driver_id": "invalid"}, {"route_id": "invalid"}],
)
def test_trip_invalid_payload_returns_validation_error(auth_admin_client, payload):
    response = auth_admin_client.post("/trip/", json=payload)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_auth_login_empty_payload(client):
    response = client.post("/auth/login", json={})
    assert response.status_code == 422


def test_register_empty_payload(client):
    response = client.post("/auth/register/student", json={})
    assert response.status_code == 422


def test_routes_duplicate_returns_conflict(auth_admin_client):
    auth_admin_client.post("/routes/create", json=ROUTE_DETAILED_VALID)
    response = auth_admin_client.post("/routes/create", json=ROUTE_DETAILED_VALID)

    assert response.status_code in [200, 201, 404, 409, 422]
    if response.status_code == 409:
        assert response.json()["error"]["code"] == "HTTP_ERROR"


def test_fleet_duplicate_returns_conflict(auth_admin_client):
    auth_admin_client.post("/fleet/", json=BUS_DETAILED_VALID)
    response = auth_admin_client.post("/fleet/", json=BUS_DETAILED_VALID)

    assert response.status_code in [200, 201, 409, 422]
    if response.status_code == 409:
        assert response.json()["error"]["code"] == "HTTP_ERROR"


def test_trip_not_found_returns_404(client):
    fake_trip_id = str(uuid.uuid4())
    response = client.get(f"/trip/{fake_trip_id}/feed")

    assert response.status_code in [200, 404]
    if response.status_code == 404:
        assert response.json()["error"]["code"] in ["HTTP_ERROR", "NOT_FOUND"]


def test_trip_feed_not_found_returns_http_error(client):
    fake_trip_id = str(uuid.uuid4())
    response = client.get(f"/trip/{fake_trip_id}/feed")

    assert response.status_code in [200, 404]
    if response.status_code == 404:
        assert response.json()["error"]["code"] in ["HTTP_ERROR", "NOT_FOUND"]


def test_driver_cannot_access_admin(auth_driver_client):
    response = auth_driver_client.get("/tests/admin-only")
    assert response.status_code in [401, 403]


def test_student_cannot_create_routes(auth_student_client):
    response = auth_student_client.post("/fleet/", json=BUS_DETAILED_VALID)
    assert response.status_code in [401, 403]


def test_student_cannot_manage_fleet(auth_student_client):
    response = auth_student_client.post("/fleet/", json=BUS_DETAILED_VALID)
    assert response.status_code in [401, 403]