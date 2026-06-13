import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { MOCK_TRIP_ME_SUBSCRIBED_PAYLOAD } from '../fixtures/trip_payloads';
import {
  mockSubscribedTripFeed,
  mockTripCancellation,
  mockUserTrips,
  mockTripFeed,
  mockTripDetails,
  mockRouteDetails,
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

  await mockUserMe(page, {
    user_id: 'student-123',
    full_name: 'Student Name',
    profile: 'Student',
    email: 'student@uefs.br',
    registration_id: '12345678',
  });
}

test.describe('Trip Cancellation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateStudent(page);
  });

  test('Student can cancel an existing trip subscription', async ({ page }) => {
    // Setup initial mocks representing a user already subscribed to a trip
    await mockSubscribedTripFeed(page);
    await mockUserTrips(page, MOCK_TRIP_ME_SUBSCRIBED_PAYLOAD);
    await mockTripDetails(page);
    await mockRouteDetails(page);

    // Navigate to dashboard
    await page.goto('/passageiro', { waitUntil: 'networkidle' });

    // Wait for trip card to appear
    await expect(page.getByText(/Terminal Central/i)).toBeVisible();

    // Verify the 'Ver minha inscrição' button is displayed instead of subscribe
    const viewSubscriptionButton = page.getByRole('button', { name: /Ver minha inscrição/i }).first();
    await expect(viewSubscriptionButton).toBeVisible();

    // Click it to go to status page
    await viewSubscriptionButton.click();

    // Should navigate to the status page
    await expect(page).toHaveURL(/.*\/passageiro\/status\?viagemId=trip-123/);

    // Setup mock for cancellation API
    await mockTripCancellation(page);

    // Wait for the cancellation request to be triggered
    const cancelRequestPromise = page.waitForRequest(request => 
      request.url().includes('/users/driver/reservations/') && request.url().includes('/delete-staff-generic') && request.method() === 'DELETE'
    );

    // Click the cancel button on the status page
    // Note: status-viagem-screen.tsx has a button with text "CANCELAR MINHA INSCRIÇÃO"
    const cancelButton = page.getByRole('button', { name: /CANCELAR MINHA INSCRIÇÃO/i }).first();
    await expect(cancelButton).toBeVisible();

    // Accept the window alert confirm that says "Tem certeza que deseja cancelar sua vaga?"
    page.on('dialog', dialog => dialog.accept());

    await cancelButton.click();

    // Verify the cancellation request went through
    const cancelRequest = await cancelRequestPromise;
    expect(cancelRequest).toBeTruthy();

    // Simulate the state update by replacing the feed mock to return unsubscribed state
    await mockTripFeed(page); // default feed payload where user is not subscribed
    await mockUserTrips(page); // default is empty

    // It should navigate back to passageiro
    await expect(page).toHaveURL(/.*\/passageiro/);

    // The button should eventually change back to 'Inscrever-se'
    const subscribeButton = page.getByRole('button', { name: /Inscrever-se/i }).first();
    await expect(subscribeButton).toBeVisible();
  });
});
