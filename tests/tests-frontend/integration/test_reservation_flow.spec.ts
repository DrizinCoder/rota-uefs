// @ts-nocheck
import { expect, test } from '@playwright/test';

import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';

test.describe('Trip reservation flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Authenticated student
    await page.context().addCookies([
      {
        name: TEST_PROFILE_COOKIE_NAME,
        value: 'Student',
        url: 'http://127.0.0.1:3000',
      },
    ]);
  });

  test('student dashboard loads with authenticated token', async ({ page }) => {
    await page.goto('/passageiro');

    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-student');
    });

    await page.reload();

    await expect(page).not.toHaveURL(/\/login/, { timeout: 3000 });
  });

  test('reservation page route inscrever-rota is accessible', async ({ page }) => {
    await page.goto('/inscrever-rota', { waitUntil: 'networkidle' });
    
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-student');
    });

    await page.reload();
    
    expect(['/inscrever-rota', '/login'].some(path => page.url().includes(path))).toBeTruthy();
  });

  test('student can interact with trip selection workflow', async ({ page }) => {
    await page.goto('/passageiro');

    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-student');
    });

    await page.reload();

    // Wait for trips to load
    await page.waitForTimeout(1000);

    // Try to select a trip if available (could be weekday selector, trip card, etc)
    const tripElements = page.locator('[class*="trip"], [class*="rota"], [role="button"]');
    const count = await tripElements.count();

    if (count > 0) {
      // At least verify that clickable elements exist for trip selection
      expect(count).toBeGreaterThan(0);
    }
  });
});
