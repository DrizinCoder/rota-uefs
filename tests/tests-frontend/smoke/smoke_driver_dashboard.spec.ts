// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

const DRIVER_ROUTES = ['/motorista', '/motorista/passageiros', '/motorista/embarque'];

async function authenticateDriver(page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Driver',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('token', 'smoke-driver-token');
  });
}

test.describe('Smoke - dashboard driver', () => {
  for (const route of DRIVER_ROUTES) {
    test(`carries protected route: ${route}`, async ({ page }) => {
      await authenticateDriver(page);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
