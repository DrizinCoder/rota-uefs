// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

const STUDENT_ROUTES = ['/passageiro', '/passageiro/status', '/passageiro/confirmacao'];

async function authenticateStudent(page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Student',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('token', 'smoke-student-token');
  });
}

test.describe('Smoke - dashboard student', () => {
  for (const route of STUDENT_ROUTES) {
    test(`carries protected route: ${route}`, async ({ page }) => {
      await authenticateStudent(page);
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
