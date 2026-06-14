import { expect, test } from '@playwright/test';
import { mockAuthRecoveryFailure, mockAuthRecoverySuccess } from '../mocks/mock_auth_api';

test.describe('Password Recovery Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recuperar-senha', { waitUntil: 'networkidle' });
  });

  test('Password Recovery - Success', async ({ page }) => {
    await mockAuthRecoverySuccess(page);

    await page.getByLabel(/e-mail/i).first().fill('test@example.com');
    await page.getByRole('button', { name: /enviar/i }).first().click();

    await expect(page.getByText(/e-mail enviado/i)).toBeVisible();
  });

  test('Password Recovery - Failure (Email not found)', async ({ page }) => {
    await mockAuthRecoveryFailure(page);

    await page.getByLabel(/e-mail/i).first().fill('notfound@example.com');
    await page.getByRole('button', { name: /enviar/i }).first().click();

    await expect(page.getByText(/e-mail não encontrado/i)).toBeVisible();
  });
});
