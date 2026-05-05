// @ts-nocheck
import type { Page } from '@playwright/test';

import { PROFILE_LABELS } from '../fixtures/profile_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockCurrentUserProfile(page: Page, profile: keyof typeof PROFILE_LABELS = 'Student') {
  await mockJsonRoute(page, '**/users/me', {
    data: {
      profile,
      label: PROFILE_LABELS[profile],
    },
  });
}
