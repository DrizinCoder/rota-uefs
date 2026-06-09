import logging

def setup_app_logging():
    root_logger = logging.getLogger()
    if root_logger.hasHandlers():
        return

    root_logger.setLevel(logging.INFO)
    
    console_handler = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s | %(asctime)s | %(name)s | %(message)s')
    console_handler.setFormatter(formatter)
    
    root_logger.addHandler(console_handler)