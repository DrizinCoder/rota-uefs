// @ts-nocheck
import { expect, test, type Page } from '@playwright/test';

import {
	ADMIN_TEST_TOKEN,
	BUS_DUPLICATE_VALUES,
	BUS_SUCCESS_VALUES,
} from '../fixtures/fleet_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import {
	mockAdminHomeInfo,
	mockBusCreationFailure,
	mockBusCreationSuccess,
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
	const plateInput = page.getByLabel(/placa/i).first();
	await expect(plateInput).toBeVisible();
	await expect(plateInput).toBeEnabled();
	await plateInput.fill(values.plate);

	const capacityInput = page.getByLabel(/capacidade/i).first();
	await expect(capacityInput).toBeVisible();
	await expect(capacityInput).toBeEnabled();
	await capacityInput.fill(values.capacity);

	const statusSelect = page.getByLabel(/status operacional/i).first();
	await expect(statusSelect).toBeVisible();
	await expect(statusSelect).toBeEnabled();
	await statusSelect.selectOption(values.status);
}

test.describe('Fleet Management Flow', () => {
	test.beforeEach(async ({ page }) => {
		await authenticateAdmin(page);
	});

	test('Bus Registration - Success Redirects', async ({ page }) => {
		await mockBusCreationSuccess(page);
		await mockAdminHomeInfo(page);

		await page.goto('/admin/onibus?modo=novo', { waitUntil: 'domcontentloaded' });
		await fillBusForm(page);

			const responsePromise = page.waitForResponse((response) => (
				response.url().includes('/fleet') &&
				response.request().method() === 'POST'
			));

			await page.getByRole('button', { name: /cadastrar ônibus/i }).first().click();

			const response = await responsePromise;
			expect(response.status()).toBe(201);

			await expect(page).toHaveURL(/\/admin\/onibus(\?|$)/, { timeout: 15000 });
	});

	test('Bus Registration - Duplicate Plate Failure', async ({ page }) => {
		await mockBusCreationFailure(page);

		await page.goto('/admin/onibus?modo=novo', { waitUntil: 'domcontentloaded' });
		await fillBusForm(page, BUS_DUPLICATE_VALUES);

			const responsePromise = page.waitForResponse((response) => (
				response.url().includes('/fleet') &&
				response.request().method() === 'POST'
			));

		await page.getByRole('button', { name: /cadastrar ônibus/i }).first().click();

			const response = await responsePromise;
			expect(response.status()).toBe(400);

		await expect(page.getByText(/erro ao salvar ônibus/i)).toBeVisible();
		await expect(page).toHaveURL(/\/admin\/onibus/);
	});
});
