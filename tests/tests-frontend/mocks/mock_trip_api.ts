// @ts-nocheck
import type { Page } from '@playwright/test';

import { TRIP_SAMPLE } from '../fixtures/trip_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockTripList(page: Page) {
  await mockJsonRoute(page, '**/trips**', {
    data: [TRIP_SAMPLE],
  });
}
