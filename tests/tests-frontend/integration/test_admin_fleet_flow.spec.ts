// @ts-nocheck
import { expect, test, type Page } from '@playwright/test';

import {
	ADMIN_TEST_TOKEN,
	BUS_DUPLICATE_VALUES,
	BUS_SUCCESS_VALUES,
	ROUTE_FAILURE_VALUES,
	ROUTE_SUCCESS_VALUES,
} from '../fixtures/fleet_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import {
	mockAdminHomeInfo,
	mockBusCreationFailure,
	mockBusCreationSuccess,
	mockTripCreationDependencies,
	mockTripCreationFailure,
	mockTripCreationSuccess,
} from '../mocks/mock_fleet_api';
import { mockCurrentUserProfile } from '../mocks/mock_user_api';

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

async function fillBusForm(page: Page, values = BUS_SUCCESS_VALUES) {
	await page.getByLabel(/placa/i).first().fill(values.plate);
	await page.getByLabel(/capacidade/i).first().fill(values.capacity);
	await page.getByLabel(/status operacional/i).first().selectOption(values.status);
}

async function fillTripForm(page: Page, values = ROUTE_SUCCESS_VALUES) {
	await page.locator('select').nth(0).selectOption(values.recurrence);
	await page.getByRole('radio', { name: /somente ida/i }).first().check();
	await page.locator('select').nth(1).selectOption(values.routeId);
	await page.locator('input[type="date"]').first().fill(values.tripDate);
	await page.locator('input[type="time"]').first().fill(values.departureTime);
	await page.locator('select').nth(2).selectOption(values.busPlate);
	await page.locator('select').nth(3).selectOption(values.driverId);
}

test.describe('Fleet and Route Management Flow', () => {
	test.beforeEach(async ({ page }) => {
		await authenticateAdmin(page);
	});

	test('Bus Registration - Success Redirects', async ({ page }) => {
		await mockBusCreationSuccess(page);
		await mockAdminHomeInfo(page);

		await page.goto('/admin/onibus?modo=novo', { waitUntil: 'networkidle' });
		await fillBusForm(page);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/fleet/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /cadastrar ônibus/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(201);

		await expect(page).toHaveURL(/\/admin\/?$/);
	});

	test('Bus Registration - Duplicate Plate Failure', async ({ page }) => {
		await mockBusCreationFailure(page);

		await page.goto('/admin/onibus?modo=novo', { waitUntil: 'networkidle' });
		await fillBusForm(page, BUS_DUPLICATE_VALUES);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/fleet/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /cadastrar ônibus/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(400);

		await expect(page.getByText(/erro ao salvar ônibus/i)).toBeVisible();
		await expect(page).toHaveURL(/\/admin\/onibus/);
	});

	test('Trip Registration - Success', async ({ page }) => {
		await mockTripCreationDependencies(page);
		await mockTripCreationSuccess(page);

		await page.goto('/admin/viagens/cadastro', { waitUntil: 'networkidle' });
		await expect(page.locator('select').nth(1)).toBeEnabled({ timeout: 5000 });
		await fillTripForm(page, ROUTE_SUCCESS_VALUES);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/trip/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /salvar viagem/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(201);

		await expect(page.getByText(/viagem cadastrada e associada ao veículo com sucesso/i)).toBeVisible();
	});

	test('Trip Registration - Invalid Schedule Failure', async ({ page }) => {
		await mockTripCreationDependencies(page);
		await mockTripCreationFailure(page);

		await page.goto('/admin/viagens/cadastro', { waitUntil: 'networkidle' });
		await expect(page.locator('select').nth(1)).toBeEnabled({ timeout: 5000 });
		await fillTripForm(page, ROUTE_FAILURE_VALUES);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/trip/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /salvar viagem/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(400);

		await expect(page.getByText(/horário inválido/i)).toBeVisible();
	});
});
