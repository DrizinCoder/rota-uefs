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
    if (request.method() === 'POST' || request.method() === 'GET') {
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
