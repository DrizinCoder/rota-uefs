// @ts-nocheck
import type { Page } from '@playwright/test';

import { PROFILE_LABELS, PROFILE_EDIT_SUCCESS_MESSAGE } from '../fixtures/profile_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockCurrentUserProfile(page: Page, profile: keyof typeof PROFILE_LABELS = 'Student') {
  await mockJsonRoute(page, '**/users/me', {
    data: {
      user_id: 'test-user-123',
      full_name: 'Usuário de Teste',
      registration_id: '123456',
      email: 'teste@uefs.br',
      phone: '75999999999',
      profile,
      label: PROFILE_LABELS[profile],
    },
  });
}

export async function mockUpdateUserProfileSuccess(page: Page) {
  await mockJsonRoute(page, '**/users/update/**', { detail: PROFILE_EDIT_SUCCESS_MESSAGE }, 200);
}

export async function mockDeleteUserAccountSuccess(page: Page) {
  await mockJsonRoute(page, '**/users/delete/account/me', null, 204);
}
