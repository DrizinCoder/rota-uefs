// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

const ADMIN_ROUTES = ['/admin', '/admin/motoristas', '/admin/onibus', '/admin/viagens'];

async function authenticateAdmin(page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Admin',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('token', 'smoke-admin-token');
  });
}

test.describe('Smoke - dashboard admin', () => {
  for (const route of ADMIN_ROUTES) {
    test(`carries protected route: ${route}`, async ({ page }) => {
      await authenticateAdmin(page);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
