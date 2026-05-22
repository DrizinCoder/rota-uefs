import type { UserProfile } from './auth_payloads';

export const TEST_PROFILE_COOKIE_NAME = 'user_profile';

export const PROFILE_REDIRECTS: Record<UserProfile, string> = {
  Student: '/passageiro',
  Staff: '/professor',
  Faculty: '/professor',
  Driver: '/motorista',
  Admin: '/admin',
};

export const PROFILE_LABELS: Record<UserProfile, string> = {
  Student: 'Aluno',
  Staff: 'Servidor',
  Faculty: 'Professor',
  Driver: 'Motorista',
  Admin: 'Administrador',
};
