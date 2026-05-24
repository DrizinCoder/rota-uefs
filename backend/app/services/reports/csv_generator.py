import io
import csv
from typing import Any, Dict, List

class CsvGenerator():

    def __init__(self):
        pass

    def generate_csv(self, data: List[Dict[str, Any]], headers: List[str]):
        csv_buffer = io.StringIO()
        writer = csv.DictWriter(csv_buffer, fieldnames=headers)

        writer.writeheader()
        writer.writerows(data)
        csv_string = csv_buffer.getvalue()
        
        return csv_string.encode("utf-8")
