// @ts-nocheck
import { expect, test } from '@playwright/test';

import { LOGIN_INVALID_PAYLOAD, LOGIN_VALID_PAYLOAD } from '../fixtures/auth_payloads';
import { LOGIN_FORM_LABELS } from '../fixtures/form_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockAuthLoginFailure, mockAuthLoginSuccess } from '../mocks/mock_auth_api';

test.describe('Fluxo de login', () => {
  test('login bem-sucedido redireciona para o perfil do aluno', async ({ page }) => {
    await mockAuthLoginSuccess(page);
    await page.goto('/login');

    await page.getByLabel(LOGIN_FORM_LABELS.registrationId).fill(LOGIN_VALID_PAYLOAD.registration_id);
    await page.locator('input[type="password"]').fill(LOGIN_VALID_PAYLOAD.password);
    await page.getByRole('button', { name: LOGIN_FORM_LABELS.submit }).click();

    await expect(page).toHaveURL(/\/passageiro$/);
    const cookies = await page.context().cookies();
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: TEST_PROFILE_COOKIE_NAME, value: 'Student' }),
      ]),
    );
  });

  test('login inválido mantém a tela e mostra erro', async ({ page }) => {
    await mockAuthLoginFailure(page);
    await page.goto('/login');

    await page.getByLabel(LOGIN_FORM_LABELS.registrationId).fill(LOGIN_INVALID_PAYLOAD.registration_id);
    await page.locator('input[type="password"]').fill(LOGIN_INVALID_PAYLOAD.password);
    await page.getByRole('button', { name: LOGIN_FORM_LABELS.submit }).click();

    await expect(page.getByText('Matrícula ou senha incorretos.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
