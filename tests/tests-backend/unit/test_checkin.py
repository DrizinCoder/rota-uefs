from app.DTOs.checkin import CheckinRequestDTO, ManualCheckinRequestDTO


def test_checkin_dto_import():
    assert CheckinRequestDTO.__name__ == 'CheckinRequestDTO'
    assert ManualCheckinRequestDTO.__name__ == 'ManualCheckinRequestDTO'
