from pathlib import Path
from jinja2 import FileSystemLoader
from app.services.email.template_service import TemplateService


def test_template_service_renders_existing_template():
    service = TemplateService()
    template_dir = Path(__file__).resolve().parents[3] / 'backend' / 'app' / 'templates' / 'emails'
    service.env.loader = FileSystemLoader(str(template_dir))

    html = service.render('welcome.html', {'name': 'Ana', 'link': 'https://rota-uefs/test'})

    assert 'Ana' in html
    assert 'https://rota-uefs/test' in html
