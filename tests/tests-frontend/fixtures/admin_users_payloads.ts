// @ts-nocheck

export interface PendingStaffUser {
  user_id: string;
  full_name: string;
  registration_id: string;
  email: string | null;
  phone: string;
  department: string;
  employment_type: string;
  registration_status: string;
}

export interface AdminFormValues {
  name: string;
  registrationId: string;
  email: string;
  password: string;
  accessLevel: 'Operator' | 'Master';
}

export const ADMIN_USERS_TEST_TOKEN = 'playwright-admin-users-token';

export const PENDING_STAFF_SAMPLE: PendingStaffUser = {
  user_id: 'staff-001',
  full_name: 'Carlos Eduardo Silva',
  registration_id: '20240001',
  email: 'carlos.silva@uefs.br',
  phone: '(75) 99999-0001',
  department: 'DTEC',
  employment_type: 'Servidor',
  registration_status: 'Pending',
};

export const PENDING_STAFF_RESPONSE = {
  data: [PENDING_STAFF_SAMPLE],
};

export const STAFF_APPROVE_SUCCESS_RESPONSE = {
  data: {
    user_id: PENDING_STAFF_SAMPLE.user_id,
    registration_status: 'Active',
  },
};

export const STAFF_APPROVE_ERROR_RESPONSE = {
  message: 'Erro ao aprovar usuário',
  detail: 'Erro ao aprovar usuário',
};

export const ADMIN_FORM_VALUES: AdminFormValues = {
  name: 'Administrador de Teste',
  registrationId: '20260001',
  email: 'admin.teste@uefs.br',
  password: 'senha-teste-123',
  accessLevel: 'Master',
};

export const ADMIN_CREATE_SUCCESS_RESPONSE = {
  data: {
    admin_id: 'admin-001',
    full_name: ADMIN_FORM_VALUES.name,
    registration_id: ADMIN_FORM_VALUES.registrationId,
    email: ADMIN_FORM_VALUES.email,
    access_level: ADMIN_FORM_VALUES.accessLevel,
  },
};

export const ADMIN_CREATE_ERROR_RESPONSE = {
  message: 'E-mail já está em uso',
  detail: 'E-mail já está em uso',
};