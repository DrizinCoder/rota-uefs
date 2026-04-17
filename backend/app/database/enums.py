from enum import Enum

class UserProfile(str, Enum):
    STUDENT = "Student"
    STAFF = "Staff"
    DRIVER = "Driver"
    ADMIN = "Admin"

class RegistrationStatus(str, Enum):
    PENDING = "Pending"
    ACTIVE = "Active"
    BLOCKED = "Blocked"

class EmploymentType(str, Enum):
    FACULTY = "Faculty"
    STAFF = "Staff"
    GUEST = "Guest"

class AccessLevel(str, Enum):
    MASTER = "Master"
    OPERATOR = "Operator"

class BusStatus(str, Enum):
    ACTIVE = "Active"
    MAINTENANCE = "Maintenance"
    INACTIVE = "Inactive"