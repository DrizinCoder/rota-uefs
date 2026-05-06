// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

test.describe('Dashboard access by profile', () => {
  test('professor dashboard is accessible with authenticated token', async ({ page }) => {
    await page.context().addCookies([
      {
        name: TEST_PROFILE_COOKIE_NAME,
        value: 'Staff',
        url: 'http://127.0.0.1:3000',
      },
    ]);

    await page.goto('/professor');

    // Configura localStorage após a página carregar
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-professor');
    });

    await page.reload();

    await expect(page).not.toHaveURL(/\/login/, { timeout: 3000 });
  });

  test('driver dashboard is accessible with authenticated token', async ({ page }) => {
    await page.context().addCookies([
      {
        name: TEST_PROFILE_COOKIE_NAME,
        value: 'Driver',
        url: 'http://127.0.0.1:3000',
      },
    ]);

    await page.goto('/motorista');

    // Configura localStorage após a página carregar
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-driver');
    });

    await page.reload();

    await expect(page).not.toHaveURL(/\/login/, { timeout: 3000 });
  });

  test('admin dashboard is accessible with authenticated token', async ({ page }) => {
    await page.context().addCookies([
      {
        name: TEST_PROFILE_COOKIE_NAME,
        value: 'Admin',
        url: 'http://127.0.0.1:3000',
      },
    ]);

    await page.goto('/admin');

    // Configura localStorage após a página carregar
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-admin');
    });

    await page.reload();

    await expect(page).not.toHaveURL(/\/login/, { timeout: 3000 });
  });
});
