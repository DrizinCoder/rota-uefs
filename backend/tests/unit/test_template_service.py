import os
from jinja2 import Environment, FileSystemLoader
from app.services.email.template_service import TemplateService


def test_template_service_renders_welcome_template():
    service = TemplateService()
    template_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..', '..', 'app', 'templates', 'emails')
    )
    service.env = Environment(loader=FileSystemLoader(template_dir))

    html = service.render(
        'welcome.html',
        {'name': 'Ana', 'link': 'https://rota-uefs/test'}
    )

    assert 'Ana' in html
    assert 'https://rota-uefs/test' in html
