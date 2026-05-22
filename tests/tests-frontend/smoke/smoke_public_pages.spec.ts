// @ts-nocheck
import { expect, test } from '@playwright/test';

const PUBLIC_ROUTES = ['/', '/login', '/cadastro/aluno', '/cadastro/professor', '/recuperar-senha'];

test.describe('Smoke - public pages', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`renders without error: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      await expect(page).toHaveURL(new RegExp(route === '/' ? '/$' : route));
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('main, form, [role="main"], button, input, a[href]').first()).toBeVisible();
    });
  }
});
