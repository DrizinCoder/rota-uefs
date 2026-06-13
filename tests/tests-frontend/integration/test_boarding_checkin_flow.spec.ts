import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { MOCK_TRIP_ME_SUBSCRIBED_PAYLOAD } from '../fixtures/trip_payloads';
import {
  mockTripFeed,
  mockTripDetails,
  mockRouteDetails,
  mockUserTrips,
} from '../mocks/mock_trip_api';
import { mockQRCodeCheckin } from '../mocks/mock_checkin_api';
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

  await mockTripFeed(page);
  await mockUserTrips(page, MOCK_TRIP_ME_SUBSCRIBED_PAYLOAD);
  await mockTripDetails(page);
  await mockRouteDetails(page);
}

test.describe('Boarding Checkin Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateStudent(page);
  });

  test('Student can navigate to status page and view boarding QR code', async ({ page }) => {
    // Navigate directly to status page
    await page.goto('/passageiro/status?viagemId=trip-123', { waitUntil: 'networkidle' });

    // Verify trip status details
    await expect(page.getByText(/Terminal Central/i, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/UEFS/i, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/06\/10\/2025/i, { exact: true })).toBeVisible();

    // Mock QR Code API
    await mockQRCodeCheckin(page);

    // Click on "VISUALIZAR CÓDIGO"
    const viewCodeButton = page.getByRole('button', { name: /VISUALIZAR CÓDIGO/i });
    await expect(viewCodeButton).toBeVisible();
    await viewCodeButton.click();

    // Should navigate to embarque page
    await expect(page).toHaveURL(/.*\/passageiro\/validar\?trip_id=trip-123/);

    // Verify QR code is rendered
    await expect(page.getByText(/Embarque/i, { exact: true })).toBeVisible();
    await expect(page.getByText(/Student Name/i, { exact: true })).toBeVisible();
    
    // Check if the image with QR code is present
    const qrImage = page.getByAltText(/QR Code de Student Name/i);
    await expect(qrImage).toBeVisible();
    await expect(qrImage).toHaveAttribute('src', /data:image\/png;base64,.+/);
  });
});
