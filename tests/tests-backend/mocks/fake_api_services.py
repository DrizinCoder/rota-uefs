from __future__ import annotations

import uuid
from copy import deepcopy
from typing import Any
from unittest.mock import AsyncMock

from fastapi import HTTPException

from fixtures.api_payloads import (
    DEFAULT_BUS_PLATE,
    DEFAULT_CHECKIN_TRIP_ID,
    DEFAULT_ROUTE_ID,
    DEFAULT_RESERVATION_ID,
    DEFAULT_TRIP_ID,
    DEFAULT_USER_ID,
    DEFAULT_WEB_PUSH_ENDPOINT,
)



class FakeRouteService:
    def __init__(self):
        self.routes: dict[str, dict[str, Any]] = {
            str(DEFAULT_ROUTE_ID): {
                "route_id": str(DEFAULT_ROUTE_ID),
                "name": "Rota Campus Centro",
                "boarding_point": "Portaria Principal",
                "drop_off_point": "Terminal Central",
            }
        }

    def _serialize(self, payload):
        if hasattr(payload, "model_dump"):
            return payload.model_dump(mode="json")
        if isinstance(payload, dict):
            return deepcopy(payload)
        return payload

    async def create(self, dados):
        payload = self._serialize(dados)
        if any(route["name"] == payload.get("name") for route in self.routes.values()):
            raise HTTPException(status_code=409, detail="Route already exists")

        route_id = str(uuid.uuid4())
        route = {
            "route_id": route_id,
            "name": payload["name"],
            "boarding_point": payload["boarding_point"],
            "drop_off_point": payload["drop_off_point"],
        }
        self.routes[route_id] = route
        return route

    async def get_all(self):
        return list(self.routes.values())

    async def get_by_id(self, route_id):
        route_id = str(route_id)
        if route_id not in self.routes:
            raise HTTPException(status_code=404, detail="Route not found")
        return self.routes[route_id]

    async def patch(self, route_id, dados):
        route_id = str(route_id)
        if route_id not in self.routes:
            raise HTTPException(status_code=404, detail="Route not found")

        payload = self._serialize(dados)
        self.routes[route_id].update({k: v for k, v in payload.items() if v is not None})
        return self.routes[route_id]

    async def update_full(self, route_id, dados):
        route_id = str(route_id)
        if route_id not in self.routes:
            raise HTTPException(status_code=404, detail="Route not found")

        payload = self._serialize(dados)
        self.routes[route_id] = {
            "route_id": route_id,
            "name": payload["name"],
            "boarding_point": payload["boarding_point"],
            "drop_off_point": payload["drop_off_point"],
        }
        return self.routes[route_id]

    async def delete(self, route_id):
        route_id = str(route_id)
        if route_id not in self.routes:
            raise HTTPException(status_code=404, detail="Route not found")
        self.routes.pop(route_id)
        return {"deleted": True, "route_id": route_id}


class FakeBusService:
    def __init__(self):
        self.buses: dict[str, dict[str, Any]] = {
            DEFAULT_BUS_PLATE: {
                "bus_plate": DEFAULT_BUS_PLATE,
                "capacity": 42,
                "bus_status": "Active",
            }
        }

    def _serialize(self, payload):
        if hasattr(payload, "model_dump"):
            return payload.model_dump(mode="json")
        if isinstance(payload, dict):
            return deepcopy(payload)
        return payload

    async def get_all(self):
        return list(self.buses.values())

    async def get_by_plate(self, plate: str):
        if plate not in self.buses:
            raise HTTPException(status_code=404, detail="Bus not found")
        return self.buses[plate]

    async def create(self, dados):
        payload = self._serialize(dados)
        plate = payload["bus_plate"]
        if plate in self.buses:
            raise HTTPException(status_code=409, detail="Bus already exists")

        bus = {
            "bus_plate": plate,
            "capacity": payload["capacity"],
            "bus_status": payload["bus_status"],
        }
        self.buses[plate] = bus
        return bus

    async def create_batch(self, dados):
        created = []
        for item in dados.buses:
            created.append(await self.create(item))
        return created

    async def update(self, plate: str, data):
        if plate not in self.buses:
            raise HTTPException(status_code=404, detail="Bus not found")

        payload = self._serialize(data)
        self.buses[plate].update(payload)
        self.buses[plate]["bus_plate"] = plate
        return self.buses[plate]

    async def update_batch(self, dados):
        updated = []
        for item in dados.updates:
            updated.append(await self.update(item.bus_plate, item))
        return updated

    async def delete(self, plate: str):
        if plate not in self.buses:
            raise HTTPException(status_code=404, detail="Bus not found")
        removed = self.buses.pop(plate)
        return {"deleted": True, "bus": removed}

    async def delete_batch(self, dados):
        removed = []
        for plate in dados.bus_plates:
            removed.append(await self.delete(plate))
        return removed


class FakeTripService:
    def __init__(self):
        self.trips: dict[str, dict[str, Any]] = {
            str(DEFAULT_TRIP_ID): self._build_trip(
                trip_id=str(DEFAULT_TRIP_ID),
                route_id=str(DEFAULT_ROUTE_ID),
                driver_id="driver-0001",
                status="Pending",
                trip_date="2026-06-18",
                departure_time="08:30:00",
            )
        }

    def _build_trip(
        self,
        *,
        trip_id: str,
        route_id: str,
        driver_id: str,
        status: str,
        trip_date: str,
        departure_time: str,
    ):
        return {
            "trip_id": trip_id,
            "route_id": route_id,
            "driver_id": driver_id,
            "trip_status": status,
            "boarding_point": "Portaria Principal",
            "drop_off_point": "Terminal Central",
            "departure_time": departure_time,
            "estimated_arrival": "09:20:00",
            "bus_capacity": 42,
            "total_enrolled": 10,
            "student_count": 8,
            "staff_count": 2,
            "driver_name": "Carlos Motorista",
            "bus_plate": DEFAULT_BUS_PLATE,
            "trip_date": trip_date,
            "reference_date": trip_date,
        }

    def _serialize(self, payload):
        if hasattr(payload, "model_dump"):
            return payload.model_dump(mode="json")
        if isinstance(payload, dict):
            return deepcopy(payload)
        return payload

    async def get_name_route_by_trip_id(self, trip_id):
        trip = self.trips.get(str(trip_id))
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        return {
            "trip_id": trip["trip_id"],
            "route_name": "Rota Campus Centro",
        }

    async def get_all(self):
        return list(self.trips.values())

    async def get_all_reservations(self):
        return [
            {
                "reservation_id": DEFAULT_RESERVATION_ID,
                "trip_id": str(DEFAULT_TRIP_ID),
                "user_id": str(DEFAULT_USER_ID),
                "boarding_status": "Not Boarded",
            }
        ]

    async def get_trips_for_feed(self, driver_id):
        return [trip for trip in self.trips.values() if trip["driver_id"] == str(driver_id)]

    async def get_all_trips_by_user_id(self, user_id):
        return [
            {
                "trip_id": str(DEFAULT_TRIP_ID),
                "user_id": str(user_id),
                "boarding_point": "Portaria Principal",
                "drop_off_point": "Terminal Central",
                "departure_time": "08:30:00",
                "trip_date": "2026-06-18",
                "reference_date": "2026-06-18",
            }
        ]

    async def get_trips_for_passenger(self, user_id):
        return [
            {
                "trip_id": str(DEFAULT_TRIP_ID),
                "boarding_point": "Portaria Principal",
                "drop_off_point": "Terminal Central",
                "trip_date": "2026-06-18",
                "departure_time": "08:30:00",
                "reference_date": "2026-06-18",
                "user_id": str(user_id),
            }
        ]

    async def get_trip_detail_for_feed(self, trip_id):
        trip = self.trips.get(str(trip_id))
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        return trip

    async def get_by_id(self, trip_id):
        trip = self.trips.get(str(trip_id))
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        return trip

    async def create(self, data):
        payload = self._serialize(data)
        trip_id = str(uuid.uuid4())
        trip = self._build_trip(
            trip_id=trip_id,
            route_id=payload["route_id"],
            driver_id=payload["driver_id"],
            status="Pending",
            trip_date=payload["trip_date"],
            departure_time=payload["departure_time"],
        )
        trip.update(
            {
                "bus_license_plate": payload["bus_license_plate"],
                "recurrence": payload.get("recurrence", "Single"),
            }
        )
        self.trips[trip_id] = trip
        return [trip]

    async def patch(self, trip_id, data):
        trip_id = str(trip_id)
        if trip_id not in self.trips:
            raise HTTPException(status_code=404, detail="Trip not found")
        payload = self._serialize(data)
        self.trips[trip_id].update({k: v for k, v in payload.items() if v is not None})
        return self.trips[trip_id]

    async def change_trip_status(self, trip_id, status):
        trip_id = str(trip_id)
        if trip_id not in self.trips:
            raise HTTPException(status_code=404, detail="Trip not found")
        self.trips[trip_id]["trip_status"] = status.value if hasattr(status, "value") else status
        return self.trips[trip_id]

    async def delete(self, trip_id):
        trip_id = str(trip_id)
        if trip_id not in self.trips:
            raise HTTPException(status_code=404, detail="Trip not found")
        removed = self.trips.pop(trip_id)
        return {"deleted": True, "trip": removed}


class FakeTripController:
    def __init__(self):
        self.subscriptions: dict[str, list[dict[str, Any]]] = {}
        self.reservations: dict[str, dict[str, Any]] = {}

    async def get_all_trips_by_user_id(self, user_id):
        return [
            {
                "trip_id": str(DEFAULT_TRIP_ID),
                "user_id": str(user_id),
                "boarding_point": "Portaria Principal",
                "drop_off_point": "Terminal Central",
                "departure_time": "08:30:00",
                "trip_date": "2026-06-18",
                "reference_date": "2026-06-18",
            }
        ]

    async def cancel_trip(self, trip_id):
        return {"message": "Trip canceled successfully", "trip_id": str(trip_id)}

    async def subscriber(self, user_id, trip_id, background_tasks, extra_name: str | None = None):
        current_trip_subscriptions = self.subscriptions.setdefault(str(trip_id), [])
        if any(item["user_id"] == str(user_id) for item in current_trip_subscriptions):
            raise HTTPException(status_code=409, detail="User already subscribed")

        reservation_id = str(uuid.uuid4())
        payload = {
            "reservation_id": reservation_id,
            "trip_id": str(trip_id),
            "user_id": str(user_id),
            "extra_passenger_name": extra_name,
        }
        current_trip_subscriptions.append(payload)
        self.reservations[reservation_id] = payload
        return {
            "message": "subscribed",
            **payload,
        }

    async def get_subscribers(self, trip_id, background_tasks):
        return self.subscriptions.get(str(trip_id), [])

    async def cancel_subscription(self, profile, reservation_id, background_tasks):
        reservation_id = str(reservation_id)
        reservation = self.reservations.pop(reservation_id, None)
        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")

        trip_id = reservation["trip_id"]
        self.subscriptions[trip_id] = [
            item for item in self.subscriptions.get(trip_id, [])
            if item["reservation_id"] != reservation_id
        ]
        return {
            "message": "canceled",
            "reservation_id": reservation_id,
            "trip_id": trip_id,
            "user_id": reservation["user_id"],
        }

    async def subscriber_staff_generic(self, trip_id):
        return {
            "message": "staff generic subscribed",
            "trip_id": str(trip_id),
        }

    async def remove_boarding_confirmation(self, reservation_id):
        return {
            "message": "boarding confirmation removed",
            "reservation_id": str(reservation_id),
        }

    async def delete_reservation_staff_generic(self, reservation_id):
        return {
            "message": "staff generic reservation deleted",
            "reservation_id": str(reservation_id),
        }


class FakeReservationService:
    def __init__(self):
        self.checkins: list[dict[str, Any]] = []

    async def get_checkin_code(self, current_user, trip_id):
        return {
            "trip_id": str(trip_id),
            "checkin_code": "1234.abcd",
            "user_id": current_user.sub,
        }

    async def checkin(self, trip_id, checkin_code):
        if checkin_code != "1234.abcd":
            raise HTTPException(status_code=401, detail="Checkin code inválido")

        payload = {
            "message": "Checkin realizado com sucesso",
            "trip_id": str(trip_id),
            "checkin_code": checkin_code,
        }
        self.checkins.append(payload)
        return payload

    async def manual_checkin(self, body):
        payload = {
            "message": "Checkin manual realizado com sucesso",
            "user_id": body.user_id,
            "reservation_id": body.reservation_id,
            "trip_id": body.trip_id,
        }
        self.checkins.append(payload)
        return payload


class FakeWebPushSubscriptionService:
    def __init__(self):
        self.subscriptions: dict[str, dict[str, Any]] = {}
        self.push_subscription_repo = AsyncMock()

    async def subscribe(self, user_id, data):
        if data.endpoint in self.subscriptions:
            raise HTTPException(status_code=409, detail="Subscription already exists")

        payload = {
            "user_id": str(user_id),
            "endpoint": data.endpoint,
            "p256dh": data.p256dh,
            "auth": data.auth,
        }
        self.subscriptions[data.endpoint] = payload
        return payload

    async def unsubscribe(self, user_id, data):
        if data.endpoint not in self.subscriptions:
            raise HTTPException(status_code=404, detail="Subscription not found")

        payload = self.subscriptions.pop(data.endpoint)
        return {
            "user_id": str(user_id),
            "endpoint": payload["endpoint"],
            "deleted": True,
        }

class FakeAuthService:
    """Fake authentication service for testing"""
    def __init__(self):
        self.users = {
            "student@example.com": {
                "email": "student@example.com",
                "password": "Password123!",
                "user_id": str(DEFAULT_USER_ID),
                "profile": "STUDENT",
                "registration_id": "2024000",
            }
        }
        self.tokens = {}

    async def login(self, email: str, password: str):
        if email not in self.users:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = self.users[email]
        if user["password"] != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = f"token_{user['user_id']}"
        self.tokens[token] = user
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user["user_id"],
                "email": user["email"],
                "profile": user["profile"],
            }
        }

    async def register_student(self, data):
        if data.email in self.users:
            raise HTTPException(status_code=409, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        self.users[data.email] = {
            "email": data.email,
            "password": data.password,
            "user_id": user_id,
            "profile": "STUDENT",
            "registration_id": data.registration_id,
            "full_name": data.full_name,
            "course": data.course,
        }
        return {
            "user_id": user_id,
            "email": data.email,
            "profile": "STUDENT",
            "message": "Registration successful",
        }

    async def register_driver(self, data):
        if data.email in self.users:
            raise HTTPException(status_code=409, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        self.users[data.email] = {
            "email": data.email,
            "password": data.password,
            "user_id": user_id,
            "profile": "DRIVER",
            "cpf": data.cpf,
            "license_number": data.license_number,
            "full_name": data.full_name,
        }
        return {
            "user_id": user_id,
            "email": data.email,
            "profile": "DRIVER",
            "message": "Registration successful",
        }


class FakeUserService:
    """Fake user service for testing"""
    def __init__(self):
        self.users = {
            str(DEFAULT_USER_ID): {
                "user_id": str(DEFAULT_USER_ID),
                "email": "student@example.com",
                "full_name": "Test Student",
                "profile": "STUDENT",
                "registration_id": "2024000",
                "active": True,
            }
        }

    async def get_user_profile(self, user_id: str):
        if user_id not in self.users:
            raise HTTPException(status_code=404, detail="User not found")
        
        return self.users[user_id]

    async def get_user(self, user_id: str):
        if user_id not in self.users:
            raise HTTPException(status_code=404, detail="User not found")
        
        return self.users[user_id]

    async def update_user(self, user_id: str, data):
        if user_id not in self.users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = self.users[user_id]
        if hasattr(data, "full_name"):
            user["full_name"] = data.full_name
        if hasattr(data, "email"):
            user["email"] = data.email
        
        return user

    async def delete_user(self, user_id: str):
        if user_id not in self.users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = self.users.pop(user_id)
        return {"user_id": user_id, "deleted": True}

    async def list_users(self, page: int = 1, limit: int = 10):
        users_list = list(self.users.values())
        return {
            "total": len(users_list),
            "page": page,
            "limit": limit,
            "users": users_list[:limit],
        }


class FakeAdminService:
    """Fake admin service for testing"""
    def __init__(self):
        self.dashboard_data = {
            "total_users": 150,
            "total_trips": 1250,
            "total_revenue": 50000.00,
            "active_drivers": 45,
            "active_buses": 25,
        }

    async def get_dashboard(self):
        return self.dashboard_data

    async def get_users_admin(self, page: int = 1, limit: int = 10):
        return {
            "total": 150,
            "page": page,
            "limit": limit,
            "users": [
                {
                    "user_id": str(DEFAULT_USER_ID),
                    "email": "student@example.com",
                    "profile": "STUDENT",
                    "active": True,
                }
            ],
        }

    async def batch_operations(self, operation: str, data: list):
        return {
            "operation": operation,
            "processed": len(data),
            "success": True,
        }