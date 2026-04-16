import logging
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()

def setup_logging():
    root_logger = logging.getLogger()

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s | %(name)s | %(levelname)s | %(message)s')
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    root_logger.setLevel(logging.INFO)
