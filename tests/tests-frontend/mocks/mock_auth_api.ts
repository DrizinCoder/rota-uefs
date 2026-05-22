// @ts-nocheck
import type { Page } from '@playwright/test';

import {
  AUTH_LOGIN_ERROR_MESSAGE,
  AUTH_LOGIN_STUDENT_SUCCESS,
  AUTH_REGISTER_STAFF_SUCCESS,
  AUTH_REGISTER_STUDENT_SUCCESS,
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

export { AUTH_REGISTER_STAFF_SUCCESS, AUTH_REGISTER_STUDENT_SUCCESS };
