// @ts-nocheck
import { expect, test, type Page } from '@playwright/test';

import {
	ADMIN_FORM_VALUES,
	ADMIN_USERS_TEST_TOKEN,
	PENDING_STAFF_SAMPLE,
} from '../fixtures/admin_users_payloads';
import { TEST_PROFILE_COOKIE_NAME } from '../fixtures/profile_payloads';
import { mockCurrentUserProfile } from '../mocks/mock_user_api';
import {
	mockAdminCreationFailure,
	mockAdminCreationSuccess,
	mockPendingStaffList,
	mockStaffApprovalFailure,
	mockStaffApprovalSuccess,
} from '../mocks/mock_admin_users_api';

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
	}, ADMIN_USERS_TEST_TOKEN);

	await mockCurrentUserProfile(page, 'Admin');
}

async function fillAdminForm(page: Page) {
	await page.locator('input[name="nome"]').first().fill(ADMIN_FORM_VALUES.name);
	await page.locator('input[name="matricula"]').first().fill(ADMIN_FORM_VALUES.registrationId);
	await page.locator('input[name="email"]').first().fill(ADMIN_FORM_VALUES.email);
	await page.locator('input[name="senha"]').first().fill(ADMIN_FORM_VALUES.password);
	await page.locator('select[name="access_level"]').first().selectOption(ADMIN_FORM_VALUES.accessLevel);
}

async function captureApprovalDialog(page: Page) {
	let alertMessage = '';

	page.on('dialog', async (dialog) => {
		if (dialog.type() === 'confirm') {
			await dialog.accept();
			return;
		}

		alertMessage = dialog.message();
		await dialog.accept();
	});

	return {
		getAlertMessage: () => alertMessage,
	};
}

test.describe('Admin Users Management Flow', () => {
	test.beforeEach(async ({ page }) => {
		await authenticateAdmin(page);
	});

	test('Staff Approval - Success', async ({ page }) => {
		await mockPendingStaffList(page);
		await mockStaffApprovalSuccess(page);

		await page.goto('/admin/validar-professor', { waitUntil: 'networkidle' });
		await expect(page.getByText(PENDING_STAFF_SAMPLE.full_name)).toBeVisible();

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/users/staff/accept/') &&
			response.request().method() === 'PATCH'
		));

		await captureApprovalDialog(page);
		await page.getByRole('button', { name: /aprovar/i }).first().click();

		const response = await responsePromise;
		expect([200, 204]).toContain(response.status());

		await expect(page.getByText(PENDING_STAFF_SAMPLE.full_name)).toHaveCount(0);
	});

	test('Staff Approval - Server Error', async ({ page }) => {
		await mockPendingStaffList(page);
		await mockStaffApprovalFailure(page);

		await page.goto('/admin/validar-professor', { waitUntil: 'networkidle' });
		await expect(page.getByText(PENDING_STAFF_SAMPLE.full_name)).toBeVisible();

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/users/staff/accept/') &&
			response.request().method() === 'PATCH'
		));

		const dialogState = await captureApprovalDialog(page);
		await page.getByRole('button', { name: /aprovar/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(500);

		await expect.poll(() => dialogState.getAlertMessage()).toMatch(/erro ao aprovar/i);
	});

	test('Admin Registration - Success', async ({ page }) => {
		await mockAdminCreationSuccess(page);

		await page.goto('/admin/usuarios/cadastro', { waitUntil: 'networkidle' });
		await fillAdminForm(page);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/admin/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /cadastrar administrador/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(201);

		await expect(page.getByText(/administrador cadastrado com sucesso/i)).toBeVisible();
	});

	test('Admin Registration - Duplicate Email Failure', async ({ page }) => {
		await mockAdminCreationFailure(page);

		await page.goto('/admin/usuarios/cadastro', { waitUntil: 'networkidle' });
		await fillAdminForm(page);

		const responsePromise = page.waitForResponse((response) => (
			response.url().includes('/admin/') &&
			response.request().method() === 'POST'
		));

		await page.getByRole('button', { name: /cadastrar administrador/i }).first().click();

		const response = await responsePromise;
		expect(response.status()).toBe(400);

		await expect(page.getByText(/e-mail já está em uso/i)).toBeVisible();
	});
});
