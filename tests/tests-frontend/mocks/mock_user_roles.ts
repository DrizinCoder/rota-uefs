// @ts-nocheck
import type { UserProfile } from '../fixtures/auth_payloads';

export const USER_ROLE_LABELS: Record<UserProfile, string> = {
  Student: 'Aluno',
  Staff: 'Servidor',
  Faculty: 'Professor',
  Driver: 'Motorista',
  Admin: 'Administrador',
};

export const USER_ROLE_SHORTCUTS: Record<UserProfile, string> = {
  Student: '/passageiro',
  Staff: '/professor',
  Faculty: '/professor',
  Driver: '/motorista',
  Admin: '/admin',
};
