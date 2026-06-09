REGISTER_USER_VALID = {
    "full_name": "Ana Silva",
    "password": "Senha@123",
    "registration_id": "20240001",
    "phone": "75999990001",
    "email": "ana@uefs.br",
}

REGISTER_USER_INVALID = {
    "full_name": "Ana Silva"
}

LOGIN_VALID = {
    "registration_id": "20240001",
    "password": "Senha@123",
}

LOGIN_INVALID = {
    "registration_id": "20240001"
}

RECOVER_PASSWORD_VALID = {
    "email": "ana@uefs.br"
}
