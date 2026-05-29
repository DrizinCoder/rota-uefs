// @ts-nocheck
import { expect, test } from '@playwright/test';

import { LOGIN_INVALID_PAYLOAD, LOGIN_VALID_PAYLOAD } from '../fixtures/auth_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockAuthLoginFailure, mockAuthLoginSuccess } from '../mocks/mock_auth_api';

test.describe('Login flow', () => {
  test('Login successful, redirection to student profile.', async ({ page }) => {
    await mockAuthLoginSuccess(page);
    await page.goto('/login');

    await page.getByLabel(/matr[ií]cula/i).first().fill(LOGIN_VALID_PAYLOAD.registration_id);
    await page.getByLabel(/senha/i).first().fill(LOGIN_VALID_PAYLOAD.password);

    const responsePromise = page.waitForResponse((response) => 
      response.url().includes('/auth/login') && response.status() === 200
    );
    await page.getByRole('button', { name: /entrar/i }).first().click();
    await responsePromise;

    await expect(page).toHaveURL(/\/passageiro/, { timeout: 10000 });

    const cookies = await page.context().cookies();
    expect(cookies.some(c => c.name === TEST_PROFILE_COOKIE_NAME && c.value === 'Student')).toBeTruthy();
  });

  test('Invalid login: screen remains on and displays error.', async ({ page }) => {
    await mockAuthLoginFailure(page);
    await page.goto('/login');

    await page.getByLabel(/matr[ií]cula/i).first().fill(LOGIN_INVALID_PAYLOAD.registration_id);
    await page.getByLabel(/senha/i).first().fill(LOGIN_INVALID_PAYLOAD.password);

    await page.getByRole('button', { name: /entrar/i }).first().click();

    await expect(page.getByText(/matr[ií]cula ou senha incorretos/i)).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/\/login/);
  });
});

