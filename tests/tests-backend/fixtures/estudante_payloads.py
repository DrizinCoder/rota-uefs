ESTUDANTE_CREATE_VALID = {
    "full_name": "Maria Estudante",
    "registration_id": "26110001",
    "phone": "+5575999990004",
    "email": "26110001@discente.uefs.br",
    "password": "Senha@1234",
}

ESTUDANTE_CREATE_INVALID = {
    "full_name": "ab",
    "registration_id": "",
    "phone": "123",
    "email": "nao-e-email",
    "password": "123",
}

ESTUDANTE_UPDATE_PHONE_VALID = {
    "phone": "+5575999990099",
}

ESTUDANTE_UPDATE_PHONE_INVALID = {
    "phone": "abc",
}

ESTUDANTE_UPDATE_PASSWORD_VALID = {
    "password": "NovaSenha@123",
    "confirm_password": "NovaSenha@123",
}

ESTUDANTE_UPDATE_PASSWORD_INVALID = {
    "password": "NovaSenha@123",
    "confirm_password": "SenhaDiferente@456",
}
