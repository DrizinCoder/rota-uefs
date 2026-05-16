from app.database.db import init_db, engine, get_session


def test_db_module_import():
    assert callable(init_db)
    assert hasattr(engine, 'dispose')
    assert callable(get_session)
