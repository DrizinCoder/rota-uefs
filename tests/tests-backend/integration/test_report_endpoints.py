import uuid

from app.routers.admin.routes import get_dashboard_controller


def test_get_audit_report_sucesso(client, fake_dashboard_controller):
    client.app.dependency_overrides[get_dashboard_controller] = lambda: fake_dashboard_controller

    trip_id = uuid.uuid4()
    response = client.get(f"/admin/report/audit?trip_id={trip_id}&format=pdf")

    assert response.status_code == 200
    assert response.json()["data"] == f"report-{trip_id}-pdf"

    client.app.dependency_overrides.pop(get_dashboard_controller, None)


def test_get_monthly_report_sucesso(client, fake_dashboard_controller):
    client.app.dependency_overrides[get_dashboard_controller] = lambda: fake_dashboard_controller

    response = client.get("/admin/report/monthly?month=2026-06-01&format=csv")

    assert response.status_code == 200
    assert response.json()["data"] == "monthly-2026-06-01-csv"

    client.app.dependency_overrides.pop(get_dashboard_controller, None)
