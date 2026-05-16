from app.routers.users.student.route_student import student_router


def test_route_student_import():
    assert student_router is not None
