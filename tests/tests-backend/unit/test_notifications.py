from app.services.engine.notifications import Notifications


def test_notifications_import():
    assert hasattr(Notifications, 'subscribe_notifications')
    assert hasattr(Notifications, 'cancel_subscription_notifications')
    assert hasattr(Notifications, 'send_trip_cancelled')
