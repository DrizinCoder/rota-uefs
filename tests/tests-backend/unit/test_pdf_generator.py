from unittest.mock import MagicMock

import app.services.reports.weasyprint_generator as generator_module
from app.services.reports.weasyprint_generator import WeasyPrintGenerator
from mocks.fake_test_helpers import DummyHTML


def test_weasyprint_generator_renders_template_and_writes_pdf(monkeypatch):
    generator = WeasyPrintGenerator()
    mock_template = MagicMock()
    mock_template.render.return_value = "<html>pdf</html>"
    monkeypatch.setattr(generator.env, "get_template", lambda name: mock_template)

    monkeypatch.setattr(generator_module, "HTML", DummyHTML)

    result = generator.generate_pdf("report.html", {"foo": "bar"}, {"log": "info"})

    assert result == b"%PDF-1.4"
    mock_template.render.assert_called_once_with(foo="bar", log={"log": "info"})
