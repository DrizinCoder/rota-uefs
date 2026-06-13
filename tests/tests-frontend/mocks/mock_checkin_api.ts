// @ts-nocheck
import type { Page } from '@playwright/test';
import { MOCK_QR_CODE_PAYLOAD } from '../fixtures/checkin_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockQRCodeCheckin(page: Page) {
  await mockJsonRoute(page, '**/users/trips/checkin_code/*', MOCK_QR_CODE_PAYLOAD);
}
