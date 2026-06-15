import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockPassengerList, mockManualCheckin } from '../mocks/mock_driver_api';
import { mockUserMe } from '../mocks/mock_user_api';

const DRIVER_TEST_TOKEN = 'test-token-driver';

async function authenticateDriver(page: Page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Driver',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, DRIVER_TEST_TOKEN);

  await mockUserMe(page, {
    user_id: 'driver-123',
    full_name: 'Driver Name',
    profile: 'Driver',
    email: 'driver@uefs.br',
  });
}

test.describe('Driver Trip Execution Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateDriver(page);
  });

  test('Driver can view passenger list and manually check-in a passenger', async ({ page }) => {
    // Flag to toggle onboard status on second fetch is simulated by changing the mock later
    await mockPassengerList(page, false);

    // Navigate directly to the passenger list for a specific trip
    await page.goto('/motorista/passageiros?trip_id=trip-123', { waitUntil: 'networkidle' });

    // Verify list loaded correctly
    await expect(page.getByText(/Lista de Passageiros/i, { exact: true })).toBeVisible();
    await expect(page.getByText(/Student Name/i)).toBeVisible();

    // Verify initial pending status
    const checkinButton = page.getByRole('button', { name: /Embarcar/i, exact: true });
    await expect(checkinButton).toBeVisible();

    // Mock the manual checkin API
    await mockManualCheckin(page);

    // Intercept again with onboard = true to simulate the refetch after checkin
    await page.route('**/users/trip/*/subscribers', async (route) => {
      // Just drop the route and add a new one with the mock function
      await route.fallback();
    });
    // Add the new mock
    await mockPassengerList(page, true);

    // Click the checkin button
    await checkinButton.click();

    // It should fetch subscribers again and change button to cancel checkin
    const cancelCheckinButton = page.getByRole('button', { name: /Cancelar Embarque/i, exact: true });
    await expect(cancelCheckinButton).toBeVisible();
  });
});
