from backend.app.services.trip_service import TripService
import logging

logger = logging.getLogger(__name__)


class TripController:
    def __init__(self, trip_service: TripService):
        self.trip_service = trip_service

    