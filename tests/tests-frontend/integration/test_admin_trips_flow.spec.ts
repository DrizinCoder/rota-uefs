// @ts-nocheck
import { expect, test, type Page } from '@playwright/test';

import {
  ADMIN_TRIPS_TEST_TOKEN,
  CREATED_ROUTE_FORM_VALUES,
  CREATED_ROUTE_OPTION,
  DEFAULT_ROUTE_OPTION,
  ROUTE_OPTIONS_FOR_TRIP,
  TRIP_FAILURE_VALUES,
  TRIP_SUCCESS_VALUES,
} from '../fixtures/admin_trips_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockCurrentUserProfile } from '../mocks/mock_user_api';
import {
  mockRouteCatalog,
  mockRouteCreationFailure,
  mockRouteCreationSuccess,
  mockTripCreationFailure,
  mockTripCreationSuccess,
  mockTripDependencies,
} from '../mocks/mock_admin_trips_api';

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
  }, ADMIN_TRIPS_TEST_TOKEN);

  await mockCurrentUserProfile(page, 'Admin');
}

async function fillTripForm(page: Page, values = TRIP_SUCCESS_VALUES) {
  await page.locator('select').nth(0).selectOption(values.recurrence);
  await page.getByRole('radio', { name: /somente ida/i }).first().check();
  await page.locator('select').nth(1).selectOption(values.routeId);
  await page.locator('input[type="date"]').first().fill(values.tripDate);
  await page.locator('input[type="time"]').first().fill(values.departureTime);
  await page.locator('select').nth(2).selectOption(values.busPlate);
  await page.locator('select').nth(3).selectOption(values.driverId);
}

async function fillRouteForm(page: Page) {
  await page.getByLabel(/nome da rota/i).first().fill(CREATED_ROUTE_FORM_VALUES.name);
  await page.getByLabel(/ponto de embarque/i).first().fill(CREATED_ROUTE_FORM_VALUES.boardingPoint);
  await page.getByLabel(/ponto de desembarque/i).first().fill(CREATED_ROUTE_FORM_VALUES.dropOffPoint);
}

test.describe('Admin Routes and Trips Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAdmin(page);
  });

  test.fixme('Route Registration - Success (Pending UI)', async ({ page }) => {
    await mockRouteCreationSuccess(page);

    await page.goto('/admin/rotas/cadastro', { waitUntil: 'networkidle' });
    await fillRouteForm(page);

    await page.getByRole('button', { name: /salvar rota/i }).first().click();

    await expect(page.getByText(/rota cadastrada com sucesso/i)).toBeVisible();
  });

  test.fixme('Route Registration - Failure (Route already exists)', async ({ page }) => {
    await mockRouteCreationFailure(page);

    await page.goto('/admin/rotas/cadastro', { waitUntil: 'networkidle' });
    await fillRouteForm(page);

    await page.getByRole('button', { name: /salvar rota/i }).first().click();

    await expect(page.getByText(/rota já cadastrada/i)).toBeVisible();
  });

  test('Trip Registration - Success', async ({ page }) => {
    await mockTripDependencies(page, ROUTE_OPTIONS_FOR_TRIP);
    await mockTripCreationSuccess(page);

    await page.goto('/admin/viagens/cadastro', { waitUntil: 'networkidle' });
    await expect(page.locator('select').nth(1)).toBeEnabled({ timeout: 5000 });

    await fillTripForm(page, TRIP_SUCCESS_VALUES);

    const responsePromise = page.waitForResponse((response) => (
      response.url().includes('/trip/') &&
      response.request().method() === 'POST'
    ));

    await page.getByRole('button', { name: /salvar viagem/i }).first().click();

    const response = await responsePromise;
    expect(response.status()).toBe(201);

    await expect(page.getByText(/viagem cadastrada e associada ao veículo com sucesso/i)).toBeVisible();
  });

  test('Trip Registration - Bus Unavailable Failure', async ({ page }) => {
    await mockTripDependencies(page, ROUTE_OPTIONS_FOR_TRIP);
    await mockTripCreationFailure(page);

    await page.goto('/admin/viagens/cadastro', { waitUntil: 'networkidle' });
    await expect(page.locator('select').nth(1)).toBeEnabled({ timeout: 5000 });

    await fillTripForm(page, TRIP_FAILURE_VALUES);

    const responsePromise = page.waitForResponse((response) => (
      response.url().includes('/trip/') &&
      response.request().method() === 'POST'
    ));

    await page.getByRole('button', { name: /salvar viagem/i }).first().click();

    const response = await responsePromise;
    expect(response.status()).toBe(400);

    await expect(page.getByText(/indisponível no momento/i)).toBeVisible();
  });
});