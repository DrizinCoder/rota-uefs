from app.controllers.dashboard_controller import DashboardController


def test_dashboard_controller_import():
    assert hasattr(DashboardController, 'get_home_info')
