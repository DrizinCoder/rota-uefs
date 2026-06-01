import uuid

from app.routers.admin.routes import get_dashboard_controller


class FakeDashboardController:
    async def trip_report(self, trip_id, file_format):
        return f"report-{trip_id}-{file_format}"

    async def monthly_report(self, month, file_format):
        return f"monthly-{month}-{file_format}"


def test_get_audit_report_sucesso(client):
    fake_dashboard_controller = FakeDashboardController()
    client.app.dependency_overrides[get_dashboard_controller] = lambda: fake_dashboard_controller

    trip_id = uuid.uuid4()
    response = client.get(f"/admin/report/audit?trip_id={trip_id}&format=pdf")

    assert response.status_code == 200
    assert response.json()["data"] == f"report-{trip_id}-pdf"

    client.app.dependency_overrides.pop(get_dashboard_controller, None)


def test_get_monthly_report_sucesso(client):
    fake_dashboard_controller = FakeDashboardController()
    client.app.dependency_overrides[get_dashboard_controller] = lambda: fake_dashboard_controller

    response = client.get("/admin/report/monthly?month=2026-06-01&format=csv")

    assert response.status_code == 200
    assert response.json()["data"] == "monthly-2026-06-01-csv"

    client.app.dependency_overrides.pop(get_dashboard_controller, None)
