// @ts-nocheck
import { expect, test, type Page } from '@playwright/test';

import {
  AUTH_REGISTER_STAFF_SUCCESS,
  AUTH_REGISTER_STUDENT_SUCCESS,
} from '../fixtures/auth_payloads';
import { mockRegisterRoute } from '../mocks/mock_auth_api';

async function fillLocatorIfPresent(page: Page, label: string | RegExp, value: string) {
  const locator = page.getByLabel(label);

  if (await locator.count()) {
    await locator.first().fill(value);
  }
}

async function fillConfirmationPasswordIfPresent(page: Page, value: string) {
  const locator = page.getByLabel(/confirmar senha/i);

  if (await locator.count()) {
    await locator.first().fill(value);
  }
}

async function fillStudentForm(page: Page) {
  await fillLocatorIfPresent(page, /nome completo/i, 'Aluno de Teste');
  await fillLocatorIfPresent(page, /telefone/i, '75900000000');
  await fillLocatorIfPresent(page, /matr[ií]cula/i, '23121111');
  await fillLocatorIfPresent(page, /e-?mail institucional/i, '23121111@discente.uefs.br');
  await fillLocatorIfPresent(page, /senha/i, 'Senha1234');
  await fillConfirmationPasswordIfPresent(page, 'Senha1234');
}

async function fillProfessorForm(page: Page) {
  await fillLocatorIfPresent(page, /nome completo/i, 'Servidor de Teste');
  await fillLocatorIfPresent(page, /matr[ií]cula/i, '20240001');
  await page.getByLabel(/v[ií]nculo/i).first().selectOption('Staff');
  await fillLocatorIfPresent(page, /departamento/i, 'DTEC');
  await fillLocatorIfPresent(page, /telefone/i, '75900000000');
  await fillLocatorIfPresent(page, /e-?mail/i, 'servidor@uefs.br');
  await fillLocatorIfPresent(page, /senha/i, 'Senha1234');
  await fillConfirmationPasswordIfPresent(page, 'Senha1234');
}

async function expectNoInvalidFields(page: Page) {
  const invalidFields = page.locator('form input:invalid, form select:invalid');
  await expect(invalidFields).toHaveCount(0);
}

test.describe('Registration Flow', () => {
  test('Student Registration - Success', async ({ page }) => {
    await mockRegisterRoute(page, 201, AUTH_REGISTER_STUDENT_SUCCESS);
    await page.goto('/cadastro/aluno', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await fillStudentForm(page);
    await expectNoInvalidFields(page);

    await page.getByRole('button', { name: /criar conta/i }).first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('Student Registration - Failure (User already exists)', async ({ page }) => {
    await mockRegisterRoute(page, 400, { detail: 'E-mail já cadastrado' });
    await page.goto('/cadastro/aluno', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await fillStudentForm(page);
    await expectNoInvalidFields(page);

    await page.getByRole('button', { name: /criar conta/i }).first().click();

    await expect(page.getByText(/erro ao realizar cadastro/i)).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/\/cadastro\/aluno/);
  });

  test('Staff Registration - Success', async ({ page }) => {
    await mockRegisterRoute(page, 201, AUTH_REGISTER_STAFF_SUCCESS);
    await page.goto('/cadastro/professor', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await fillProfessorForm(page);
    await expectNoInvalidFields(page);

    await page.getByRole('button', { name: /solicitar cadastro/i }).first().click();
    await expect(page.getByText(/cadastro em análise/i)).toBeVisible();
  });

  test('Staff Registration - Failure (Invalid SIAPE number)', async ({ page }) => {
    await mockRegisterRoute(page, 400, { detail: 'SIAPE inválido' });
    await page.goto('/cadastro/professor', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await fillProfessorForm(page);
    await expectNoInvalidFields(page);

    await page.getByRole('button', { name: /solicitar cadastro/i }).first().click();

    await expect(page.getByText(/erro ao realizar cadastro/i)).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/\/cadastro\/professor/);
  });
});