from app.routers.users.student.route_student import student_router


def test_student_router_defines_expected_endpoints():
    paths = [route.path for route in student_router.routes]
    assert "/" in paths
    assert "/matricula/{registration_id}/" in paths
