from tests.mocks.fake_email import FakeEmailService
from tests.mocks.fake_repositories import FakeUserRepository


def test_fake_user_repository_add():
    repo = FakeUserRepository()
    item = {"matricula": "20240001", "name": "Ana"}
    result = repo.add(item)

    assert result == item
    assert len(repo.list_all()) == 1


def test_fake_user_repository_get_by_matricula():
    repo = FakeUserRepository()
    repo.add({"matricula": "20240001", "name": "Ana"})

    result = repo.get_by_matricula("20240001")
    assert result is not None
    assert result["name"] == "Ana"


def test_fake_email_service_send_email():
    service = FakeEmailService()

    result = service.send_email(
        to="ana@uefs.br",
        subject="Teste",
        body="Mensagem de teste"
    )

    assert result is True
    assert len(service.sent_messages) == 1
