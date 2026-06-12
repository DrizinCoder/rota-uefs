from uuid import UUID

from app.enums.enums import BusStatus, TripRecurrence, TripStatus


DEFAULT_ROUTE_ID = UUID("11111111-1111-1111-1111-111111111111")
DEFAULT_TRIP_ID = UUID("22222222-2222-2222-2222-222222222222")
DEFAULT_CHECKIN_TRIP_ID = UUID("33333333-3333-3333-3333-333333333333")
DEFAULT_USER_ID = UUID("44444444-4444-4444-4444-444444444444")
DEFAULT_RESERVATION_ID = "RES-001"
DEFAULT_BUS_PLATE = "ABC1D23"
DEFAULT_WEB_PUSH_ENDPOINT = "https://push.example/endpoint-1"


ROUTE_CREATE_VALID = {
    "name": "Rota Campus Centro",
    "boarding_point": "Portaria Principal",
    "drop_off_point": "Terminal Central",
}

ROUTE_CREATE_INVALID = {
    "name": "Rota Incompleta",
}

ROUTE_UPDATE_VALID = {
    "name": "Rota Campus Atualizada",
    "boarding_point": "Novo Ponto de Embarque",
    "drop_off_point": "Novo Ponto de Desembarque",
}

BUS_CREATE_VALID = {
    "bus_plate": DEFAULT_BUS_PLATE,
    "capacity": 42,
    "bus_status": BusStatus.ACTIVE.value,
}

BUS_CREATE_INVALID = {
    "bus_plate": DEFAULT_BUS_PLATE,
}

BUS_UPDATE_VALID = {
    "capacity": 50,
    "bus_status": BusStatus.MAINTENANCE.value,
}

BUS_BATCH_CREATE_VALID = {
    "buses": [
        {
            "bus_plate": "XYZ9Z99",
            "capacity": 35,
            "bus_status": BusStatus.ACTIVE.value,
        },
        {
            "bus_plate": "QWE1R23",
            "capacity": 28,
            "bus_status": BusStatus.INACTIVE.value,
        },
    ]
}

BUS_BATCH_UPDATE_VALID = {
    "updates": [
        {
            "bus_plate": DEFAULT_BUS_PLATE,
            "capacity": 45,
            "bus_status": BusStatus.ACTIVE.value,
        },
        {
            "bus_plate": "XYZ9Z99",
            "capacity": 37,
            "bus_status": BusStatus.MAINTENANCE.value,
        },
    ]
}

BUS_BATCH_DELETE_VALID = {
    "bus_plates": [DEFAULT_BUS_PLATE, "XYZ9Z99"],
}

TRIP_CREATE_VALID = {
    "bus_license_plate": DEFAULT_BUS_PLATE,
    "driver_id": str(DEFAULT_USER_ID),
    "route_id": str(DEFAULT_ROUTE_ID),
    "trip_date": "2026-06-15",
    "departure_time": "08:30:00",
    "recurrence": TripRecurrence.SINGLE.value,
}

TRIP_CREATE_INVALID = {
    "bus_license_plate": DEFAULT_BUS_PLATE,
}

TRIP_UPDATE_VALID = {
    "bus_license_plate": "XYZ9Z99",
    "status": TripStatus.CONFIRMED.value,
}

CHECKIN_VALID = {
    "trip_id": str(DEFAULT_CHECKIN_TRIP_ID),
    "checkin_code": "1234.abcd",
}

CHECKIN_INVALID = {
    "trip_id": str(DEFAULT_CHECKIN_TRIP_ID),
}

MANUAL_CHECKIN_VALID = {
    "user_id": str(DEFAULT_USER_ID),
    "reservation_id": DEFAULT_RESERVATION_ID,
    "trip_id": str(DEFAULT_CHECKIN_TRIP_ID),
}

WEB_PUSH_CREATE_VALID = {
    "endpoint": DEFAULT_WEB_PUSH_ENDPOINT,
    "p256dh": "p256dh-key",
    "auth": "auth-key",
}

WEB_PUSH_CREATE_INVALID = {
    "endpoint": DEFAULT_WEB_PUSH_ENDPOINT,
}

WEB_PUSH_DELETE_VALID = {
    "endpoint": DEFAULT_WEB_PUSH_ENDPOINT,
}
# AUTENTICAÇÃO
LOGIN_VALID = {
    "email": "student@example.com",
    "password": "Password123!",
}

LOGIN_INVALID_EMAIL = {
    "email": "nonexistent@example.com",
    "password": "Password123!",
}

LOGIN_INVALID_PASSWORD = {
    "email": "student@example.com",
    "password": "WrongPassword123!",
}

REGISTER_STUDENT_VALID = {
    "email": "newstudent@example.com",
    "password": "Password123!",
    "full_name": "New Student",
    "registration_id": "2024001",
    "course": "Computer Science",
}

REGISTER_STUDENT_DUPLICATE_EMAIL = {
    "email": "student@example.com",  # Already exists
    "password": "Password123!",
    "full_name": "Another Student",
    "registration_id": "2024002",
    "course": "Computer Science",
}

REGISTER_DRIVER_VALID = {
    "email": "newdriver@example.com",
    "password": "Password123!",
    "full_name": "New Driver",
    "cpf": "12345678901",
    "license_number": "CNH123456",
}

REGISTER_STAFF_VALID = {
    "email": "newstaff@example.com",
    "password": "Password123!",
    "full_name": "New Staff",
    "cpf": "98765432109",
    "siape": "1234567",
}

# USUÁRIOS
USER_PROFILE_UPDATE_VALID = {
    "full_name": "Updated Name",
}

USER_PASSWORD_UPDATE_VALID = {
    "current_password": "OldPassword123!",
    "new_password": "NewPassword123!",
}

# ROTAS - Testes CRUD Completos
ROUTE_DETAILED_VALID = {
    "name": "Rota Executiva Campus",
    "boarding_point": "Terminal Principal",
    "drop_off_point": "Biblioteca Central",
    "departure_time": "08:00:00",
    "estimated_arrival_time": "08:30:00",
    "capacity": 50,
    "active": True,
}

ROUTE_UPDATE_COMPLETE = {
    "name": "Rota Atualizada",
    "boarding_point": "Terminal Novo",
    "drop_off_point": "Biblioteca Nova",
    "capacity": 60,
    "active": True,
}

# VIAGENS - Testes CRUD Completos
TRIP_DETAILED_VALID = {
    "route_id": str(DEFAULT_ROUTE_ID),
    "driver_id": str(DEFAULT_USER_ID),
    "bus_plate": DEFAULT_BUS_PLATE,
    "trip_date": "2026-06-20",
    "departure_time": "08:30:00",
    "estimated_arrival_time": "09:00:00",
    "status": TripStatus.PENDING.value,
    "recurrence": TripRecurrence.SINGLE.value,
}

TRIP_UPDATE_STATUS = {
    "status": TripStatus.CONFIRMED.value,
}

TRIP_CANCEL = {
    "status": TripStatus.CANCELLED.value,
}

# FROTA - Testes CRUD Completos
BUS_DETAILED_VALID = {
    "bus_plate": "ABC1234",
    "model": "Mercedes Benz O 500",
    "capacity": 42,
    "bus_status": BusStatus.ACTIVE.value,
    "registration_number": "MG123456789",
    "year": 2020,
}

BUS_UPDATE_DETAILED = {
    "bus_plate": "ABC1234",
    "model": "Mercedes Benz O 500",
    "capacity": 50,
    "bus_status": BusStatus.MAINTENANCE.value,
}

# ADMIN
ADMIN_BATCH_OPERATIONS_VALID = {
    "operation": "activate_users",
    "user_ids": [str(DEFAULT_USER_ID)],
}

# INSCRIÇÕES
TRIP_SUBSCRIPTION_VALID = {
    "trip_id": str(DEFAULT_TRIP_ID),
}

# Payloads de Erro
LOGIN_EMPTY = {}

REGISTER_EMPTY = {}

PAYMENT_INVALID_AMOUNT = {
    "amount": -100,
    "trip_id": str(DEFAULT_TRIP_ID),
}