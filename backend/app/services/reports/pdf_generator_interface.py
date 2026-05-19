from abc import ABC, abstractmethod
from typing import Dict, Any

class PDFGeneratorInterface(ABC):

    @abstractmethod
    def generate_pdf(self, data: Dict[str, Any]) -> bytes:
        pass