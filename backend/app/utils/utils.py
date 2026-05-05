import time
from datetime import datetime, timedelta

def add_ninety_minutes(t: time) -> time:
    dummy = datetime(2000, 1, 1, t.hour, t.minute, t.second)
    return (dummy + timedelta(minutes=90)).time()