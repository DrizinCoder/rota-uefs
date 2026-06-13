import { expect, test, type Page } from '@playwright/test';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockCurrentUserProfile } from '../mocks/mock_user_api';

const ADMIN_TEST_TOKEN = 'test-token-admin';

async function authenticateAdmin(page: Page) {
  await page.context().addCookies([
    {
      name: TEST_PROFILE_COOKIE_NAME,
      value: 'Admin',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, ADMIN_TEST_TOKEN);

  await mockCurrentUserProfile(page, 'Admin');
}

test.describe('Admin Reports Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAdmin(page);

    // Mock trips for the reports
    await page.route('**/trip/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              trip_id: 'trip-123',
              route_id: 'route-1',
              trip_date: '2025-10-10',
              status: 'Completed',
              bus_license_plate: 'ABC-1234',
              driver_id: 'driver-1',
              departure_time: '08:00',
              driver_name: 'John Doe',
              route_name: 'Route A',
              boarding_point: 'Point A',
              drop_off_point: 'Point B',
              total_reservations: 10,
              total_checkins: 8,
              teachers_count: 2,
              students_count: 8,
            }
          ]
        })
      });
    });
  });

  test('Should load Monthly Reports and generate PDF', async ({ page }) => {
    await page.route('**/admin/report/monthly*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: 'YmFzZTY0dGVzdHBkZg==' }) // mock base64
      });
    });

    await page.goto('/admin/relatorios', { waitUntil: 'networkidle' });

    // Ensure we are on the Monthly Reports tab by default
    await expect(page.getByText('Período de Análise')).toBeVisible();

    // Click the PDF generation button
    const pdfButton = page.getByRole('button', { name: /Exportar PDF/i });
    await expect(pdfButton).toBeVisible();

    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/admin/report/monthly') && req.url().includes('format=pdf')),
      pdfButton.click()
    ]);

    expect(request.url()).toContain('format=pdf');
  });

  test('Should switch to Insurance tab and generate Audit Report', async ({ page }) => {
    await page.route('**/admin/report/audit*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: 'YmFzZTY0dGVzdHBkZg==' })
      });
    });

    await page.goto('/admin/relatorios', { waitUntil: 'networkidle' });

    // Switch to 'Seguro de Viagem' tab
    const seguroTab = page.getByRole('button', { name: /Auditoria de Seguro/i });
    await expect(seguroTab).toBeVisible();
    await seguroTab.click();

    // Wait for trips to be loaded and visible
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Route A')).toBeVisible();

    // Find the Gerar PDF button for the trip
    const gerarSeguroPdfButton = page.getByRole('button', { name: /Baixar PDF/i }).first();
    await expect(gerarSeguroPdfButton).toBeVisible();

    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/admin/report/audit') && req.url().includes('format=pdf')),
      gerarSeguroPdfButton.click()
    ]);

    expect(request.url()).toContain('trip_id=trip-123');
    expect(request.url()).toContain('format=pdf');
  });
});
