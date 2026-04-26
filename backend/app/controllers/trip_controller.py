from backend.app.services.trip_service import TripService

class TripController:

    def __init__(self, trip_service: TripService):
        self.trip_service = trip_service

    