from jinja2 import Environment, FileSystemLoader
import os
import logging

logger = logging.getLogger(__name__)


class TemplateService:
    def __init__(self):
        template_path = os.path.join("app", "templates", "emails")
        self.env = Environment(loader=FileSystemLoader(template_path))

    def render(self, template_name: str, context: dict) -> str:
        template = self.env.get_template(template_name)
        return template.render(**context)