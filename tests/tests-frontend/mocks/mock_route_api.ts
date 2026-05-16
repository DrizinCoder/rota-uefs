// @ts-nocheck
import type { Page } from '@playwright/test';

export async function mockJsonRoute(
  page: Page,
  urlPattern: string | RegExp,
  body: unknown,
  status = 200,
) {
  await page.route(urlPattern, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      return;
    }

    if (request.method() === 'POST' || request.method() === 'GET' || request.method() === 'PATCH' || request.method() === 'DELETE' || request.method() === 'PUT') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body),
      });
    } else {
      await route.continue();
    }
  });
}
