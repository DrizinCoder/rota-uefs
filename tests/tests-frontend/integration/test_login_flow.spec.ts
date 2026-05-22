// @ts-nocheck
import { expect, test } from '@playwright/test';

import { LOGIN_INVALID_PAYLOAD, LOGIN_VALID_PAYLOAD } from '../fixtures/auth_payloads';
import { LOGIN_FORM_LABELS } from '../fixtures/form_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockAuthLoginFailure, mockAuthLoginSuccess } from '../mocks/mock_auth_api';

test.describe('Login flow', () => {
  test('Login successful, redirection to student profile.', async ({ page }) => {
    await mockAuthLoginSuccess(page);
    await page.goto('/login');

    // Preenche os campos
    await page.getByLabel(LOGIN_FORM_LABELS.registrationId).fill(LOGIN_VALID_PAYLOAD.registration_id);
    await page.locator('input[type="password"]').fill(LOGIN_VALID_PAYLOAD.password);
    
    // Aguarda a resposta da API ao clicar
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/auth/login') && response.status() === 200
    );
    await page.getByRole('button', { name: LOGIN_FORM_LABELS.submit }).click();
    await responsePromise;

    // Aguarda navegação para o dashboard do aluno
    await expect(page).toHaveURL(/\/passageiro/, { timeout: 10000 });
    
    // Verifica o cookie
    const cookies = await page.context().cookies();
    expect(cookies.some(c => c.name === TEST_PROFILE_COOKIE_NAME && c.value === 'Student')).toBeTruthy();
  });

  test('Invalid login: screen remains on and displays error.', async ({ page }) => {
    await mockAuthLoginFailure(page);
    await page.goto('/login');

    await page.getByLabel(LOGIN_FORM_LABELS.registrationId).fill(LOGIN_INVALID_PAYLOAD.registration_id);
    await page.locator('input[type="password"]').fill(LOGIN_INVALID_PAYLOAD.password);

    const submitButton = page.getByRole('button', { name: LOGIN_FORM_LABELS.submit });
    await submitButton.click();

    const errorDiv = page.locator('[class*="bg-red-50"][class*="text-red-600"]').first();
    await expect(errorDiv).toContainText('Matrícula ou senha incorretos', { timeout: 5000 });

    await expect(page).toHaveURL(/\/login/);
  });
});

