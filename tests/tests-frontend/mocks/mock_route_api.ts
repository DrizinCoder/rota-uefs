// @ts-nocheck
import type { Page } from '@playwright/test';

export async function mockJsonRoute(
  page: Page,
  urlPattern: string | RegExp,
  body: unknown,
  status = 200,
) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  };

  // Switch for real backend integration
  if (process.env.USE_MOCKS === 'false') {
    return;
  }

  await page.route(urlPattern, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: corsHeaders,
      });
      return;
    }

    if (request.method() === 'POST' || request.method() === 'GET' || request.method() === 'PATCH' || request.method() === 'DELETE' || request.method() === 'PUT') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: corsHeaders,
        body: JSON.stringify(body),
      });
    } else {
      await route.continue();
    }
  });
}
