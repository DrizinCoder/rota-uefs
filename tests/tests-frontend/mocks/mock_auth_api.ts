// @ts-nocheck
import type { Page } from '@playwright/test';

import {
  AUTH_LOGIN_ERROR_MESSAGE,
  AUTH_LOGIN_STUDENT_SUCCESS,
  AUTH_REGISTER_STAFF_SUCCESS,
  AUTH_REGISTER_STUDENT_SUCCESS,
  AUTH_RECOVERY_SUCCESS_MESSAGE,
  AUTH_RECOVERY_ERROR_MESSAGE,
} from '../fixtures/auth_payloads';
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

export async function mockRegisterRoute(page: Page, status: number, body?: unknown) {
  const responseBody = body ?? AUTH_REGISTER_STUDENT_SUCCESS;

  await page.route('**/auth/register/**', async (route) => {
    const request = route.request();
    const method = request.method();

    if (method === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
      return;
    }

    if (method === 'POST') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify(responseBody),
      });
      return;
    }

    await route.continue();
  });
}

export async function mockAuthRecoverySuccess(page: Page) {
  await mockJsonRoute(page, '**/auth/recover/password**', { detail: AUTH_RECOVERY_SUCCESS_MESSAGE }, 200);
}

export async function mockAuthRecoveryFailure(page: Page) {
  await mockJsonRoute(page, '**/auth/recover/password**', { detail: AUTH_RECOVERY_ERROR_MESSAGE }, 404);
}

export async function mockAuthLogoutSuccess(page: Page) {
  await mockJsonRoute(page, '**/auth/logout', { message: 'Logged out successfully' }, 200);
}

export { AUTH_REGISTER_STAFF_SUCCESS, AUTH_REGISTER_STUDENT_SUCCESS };
