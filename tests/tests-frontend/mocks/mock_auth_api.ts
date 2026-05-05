// @ts-nocheck
import type { Page } from '@playwright/test';

import { AUTH_LOGIN_STUDENT_SUCCESS, AUTH_LOGIN_ERROR_MESSAGE } from '../fixtures/auth_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockAuthLoginSuccess(page: Page) {
  await mockJsonRoute(page, '**/auth/login', AUTH_LOGIN_STUDENT_SUCCESS);
}

export async function mockAuthLoginFailure(page: Page) {
  await mockJsonRoute(
    page,
    '**/auth/login',
    { detail: AUTH_LOGIN_ERROR_MESSAGE },
    404,
  );
}
