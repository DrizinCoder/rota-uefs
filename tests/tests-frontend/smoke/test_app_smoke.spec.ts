// @ts-nocheck
import { expect, test } from '@playwright/test';

import { HOME_FORM_ACTIONS, LOGIN_FORM_LABELS } from '../fixtures/form_payloads';

test.describe('Smoke do frontend', () => {
  test('home page renders the primary landing actions', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'SUA CONEXÃO NO CAMPUS' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ROTA UEFS: TRANSPORTE SEGURO E EFICIENTE' })).toBeVisible();
    await expect(page.getByRole('button', { name: HOME_FORM_ACTIONS.accessSystem })).toBeVisible();
    await expect(page.getByRole('button', { name: HOME_FORM_ACTIONS.firstAccess })).toBeVisible();
  });

  test('login page renders the auth form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel(LOGIN_FORM_LABELS.registrationId)).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: LOGIN_FORM_LABELS.submit })).toBeVisible();
  });
});