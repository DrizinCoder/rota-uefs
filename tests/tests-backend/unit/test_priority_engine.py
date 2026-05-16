from app.services.engine.priority_engine import PriorityEngine


def test_priority_engine_import():
    assert hasattr(PriorityEngine, 'subscribe_user_to_trip')
    assert hasattr(PriorityEngine, 'cancel_subscription')
