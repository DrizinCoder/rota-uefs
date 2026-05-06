// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Signup flow', () => {
  test('first access button on home redirects away from home', async ({ page }) => {
    await page.goto('/');

    const firstAccessButton = page.getByRole('button', { name: /primeiro acesso|cadastro/i }).first();
    
    if (await firstAccessButton.isVisible()) {
      await firstAccessButton.click();
      
      await expect(page).not.toHaveURL('/', { timeout: 5000 });
    }
  });
});
