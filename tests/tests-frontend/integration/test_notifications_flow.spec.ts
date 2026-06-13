import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockNotificationService, mockPushSubscriptionAPI } from '../mocks/mock_notification_service';
import { mockUserMe } from '../mocks/mock_user_api';
import { mockTripFeed, mockUserTrips } from '../mocks/mock_trip_api';

const STUDENT_TEST_TOKEN = 'test-token-student';

async function authenticateStudentAndMockPush(page: Page) {
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

  await mockNotificationService(page);

  await mockUserMe(page, {
    user_id: 'student-123',
    full_name: 'Student Name',
    profile: 'Student',
    email: 'student@uefs.br',
    registration_id: '12345678',
  });

  await mockTripFeed(page);
  await mockUserTrips(page); // default is empty
}

test.describe('Notifications Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateStudentAndMockPush(page);
  });

  test('User can toggle push notifications on', async ({ page }) => {
    await mockPushSubscriptionAPI(page);

    // Navigate to passenger dashboard where the toggle exists
    await page.goto('/passageiro', { waitUntil: 'networkidle' });

    // Ensure the toggle is visible and initially off
    const toggleLabel = page.locator('label', { hasText: /Desativadas/i });
    await expect(toggleLabel).toBeVisible();

    const switchRole = page.getByRole('switch');
    await expect(switchRole).toBeVisible();
    await expect(switchRole).not.toBeChecked();

    // Start waiting for the subscribe request before clicking
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/web-push/subscribe') && request.method() === 'POST'
    );

    // Click the toggle to enable notifications
    await switchRole.click();

    // Verify the label changes to 'Ativadas'
    const enabledLabel = page.locator('label', { hasText: /Ativadas/i });
    await expect(enabledLabel).toBeVisible();
    await expect(switchRole).toBeChecked();

    // Verify the API was called
    const request = await requestPromise;
    expect(request).toBeTruthy();
  });
});
