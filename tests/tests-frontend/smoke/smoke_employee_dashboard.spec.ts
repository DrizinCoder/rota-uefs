// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

const EMPLOYEE_ROUTES = ['/passageiro'];

async function authenticateEmployee(page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Staff',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('token', 'smoke-employee-token');
  });
}

test.describe('Smoke - dashboard employee', () => {
  for (const route of EMPLOYEE_ROUTES) {
    test(`carries protected route: ${route}`, async ({ page }) => {
      await authenticateEmployee(page);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
