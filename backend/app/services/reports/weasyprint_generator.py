import os
import jinja2
from weasyprint import HTML
from typing import Dict, Any

from app.services.reports.pdf_generator_interface import PDFGeneratorInterface

class WeasyPrintGenerator(PDFGeneratorInterface):

    def __init__(self):
        templates_dir = os.path.join('app', 'templates', 'reports')
        
        self.env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(templates_dir),
            autoescape=jinja2.select_autoescape(['html', 'xml'])
        )

    def generate_pdf(self, template_name: str, context: Dict[str, Any], log_data: Dict[str, Any]) -> bytes:
        template = self.env.get_template(template_name)
        html_content = template.render(**context, log=log_data)
        pdf_bytes = HTML(string=html_content).write_pdf()
    
        return pdf_bytes