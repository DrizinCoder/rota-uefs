import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockUserMe, mockUserMeFailure } from '../mocks/mock_user_api';
import { mockTripFeed, mockUserTrips } from '../mocks/mock_trip_api';
import { mockAuthLogoutSuccess } from '../mocks/mock_auth_api';

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
  await mockUserTrips(page); // Default to empty
}

test.describe('Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateStudent(page);
  });

  test('User can logout and is protected from navigating back', async ({ page }) => {
    // Navigate to the profile page where the logout button resides
    await page.goto('/perfil', { waitUntil: 'networkidle' });

    // Ensure page loaded
    await expect(page.getByText(/Student Name/i)).toBeVisible();

    // Mock logout API call
    await mockAuthLogoutSuccess(page);

    // Locate the logout button
    const logoutButton = page.locator('button, [role="menuitem"], a').filter({ hasText: /SAIR/i }).first();
    await expect(logoutButton).toBeVisible();

    // Click logout
    await logoutButton.click();

    // Wait for redirection to login/home
    await expect(page).toHaveURL(/.*(\/login|\/)$/, { timeout: 10000 });

    // Mock API to return 401 Unauthorized for the protected route since token is cleared
    await mockUserMeFailure(page);

    // Try to navigate back to /perfil to verify security
    await page.goto('/perfil');

    // Should force redirect to login/home
    await expect(page).toHaveURL(/.*(\/login|\/)$/, { timeout: 10000 });
  });
});
