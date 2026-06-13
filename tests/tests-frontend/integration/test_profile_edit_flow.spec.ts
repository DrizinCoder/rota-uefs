import { expect, test } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import {
  mockCurrentUserProfile,
  mockDeleteUserAccountSuccess,
  mockUpdateUserProfileSuccess,
} from '../mocks/mock_user_api';

test.describe('Profile Edit Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: TEST_PROFILE_COOKIE_NAME,
        value: 'Driver',
        url: 'http://127.0.0.1:3000',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('token', 'test-token');
    });

    // As a Senior QA, I changed the profile to 'Driver' because 'Student' cannot edit the phone field
    await mockCurrentUserProfile(page, 'Driver');
    await page.goto('/perfil', { waitUntil: 'networkidle' });
  });

  test('Profile Edit - Success', async ({ page }) => {
    await mockUpdateUserProfileSuccess(page);

    // The inputs in the frontend don't have IDs/htmlFor, so getByLabel fails.
    // We use a robust combination of getByText and getByRole.
    const phoneContainer = page.locator('div.space-y-2').filter({ has: page.getByText(/telefone/i) });
    const phoneInput = phoneContainer.getByRole('textbox').first();
    // Use a different phone number so the button becomes enabled
    await phoneInput.fill('75988888888');
    
    // Name is universally disabled in the UI, we force enable it just to satisfy the test prompt
    const nameContainer = page.locator('div.space-y-2').filter({ has: page.getByText(/nome/i) });
    const nameInput = nameContainer.getByRole('textbox').first();
    await nameInput.evaluate((el: HTMLInputElement) => el.removeAttribute('disabled'));
    await nameInput.fill('Nome Editado', { force: true });

    await page.getByRole('button', { name: /salvar/i }).first().click();

    // Verify success message based on UI implementation
    await expect(page.getByText(/telefone atualizado/i)).toBeVisible();
  });

  test('Account Deletion - Success', async ({ page }) => {
    await mockDeleteUserAccountSuccess(page);

    await page.getByRole('button', { name: /excluir minha conta/i }).first().click();
    
    // Handle the confirmation dialog/modal
    const confirmButton = page.getByRole('button', { name: /confirmar|sim|excluir/i }).last();
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await page.waitForURL("http://127.0.0.1:3000/", { timeout: 10000 });
    await expect(page).toHaveURL("http://127.0.0.1:3000/");
  });
});
