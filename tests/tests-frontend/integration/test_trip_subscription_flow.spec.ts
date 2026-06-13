import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import {
  mockTripFeed,
  mockTripDetails,
  mockRouteDetails,
  mockUserTrips,
  mockTripSubscription,
} from '../mocks/mock_trip_api';
import { mockUserMe } from '../mocks/mock_user_api';

const STUDENT_TEST_TOKEN = 'test-token-student';

async function authenticateStudent(page: Page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Student',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, STUDENT_TEST_TOKEN);

  // Use the central mock functions
  await mockUserMe(page, {
    user_id: 'student-123',
    full_name: 'Student Name',
    profile: 'Student',
    email: 'student@uefs.br',
    registration_id: '12345678',
  });

  await mockTripFeed(page);
  await mockUserTrips(page); // Defaults to empty payload
}

test.describe('Trip Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateStudent(page);
  });

  test('Student can complete the trip subscription flow', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/passageiro', { waitUntil: 'networkidle' });

    // Wait for trip card to appear
    await expect(page.getByText(/Terminal Central/i)).toBeVisible();
    await expect(page.getByText(/UEFS/i, { exact: true }).first()).toBeVisible();

    // Click subscribe button
    const subscribeButton = page.getByRole('button', { name: /Inscrever-se nesta rota/i }).first();
    await expect(subscribeButton).toBeVisible();

    // Setup mocks for confirmation page
    await mockTripDetails(page);
    await mockRouteDetails(page);
    await subscribeButton.click({ force: true });

    // Should navigate to confirmation page
    await expect(page).toHaveURL(/.*\/passageiro\/confirmacao\?viagemId=trip-123/);

    // Verify confirmation details
    await expect(page.getByText(/Terminal Central/i, { exact: true })).toBeVisible();
    await expect(page.getByText(/08:00/i)).toBeVisible();

    // Setup mocks for subscribe action
    await mockTripSubscription(page);

    // Mock the status page data intercept
    await page.route('**/passageiro/status*', async (route) => {
      await route.continue();
    });

    // Click Confirm
    const confirmButton = page.getByRole('button', { name: /CONFIRMAR MINHA VAGA/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click({ force: true });

    // Should redirect to status page
    await expect(page).toHaveURL(/.*\/passageiro\/status\?viagemId=trip-123/, { timeout: 10000 });
  });
});
