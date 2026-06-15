// @ts-nocheck
import type { Page } from '@playwright/test';

import { MOCK_TRIP_FEED_PAYLOAD, MOCK_TRIP_DETAILS_PAYLOAD, MOCK_ROUTE_PAYLOAD, MOCK_TRIP_ME_EMPTY_PAYLOAD } from '../fixtures/trip_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockTripList(page: Page) {
  // Keep the original function just in case
  await mockJsonRoute(page, '**/trips**', {
    data: [],
  });
}

export async function mockTripFeed(page: Page) {
  await mockJsonRoute(page, '**/trip/feed*', MOCK_TRIP_FEED_PAYLOAD);
}

export async function mockTripDetails(page: Page) {
  await mockJsonRoute(page, '**/trip/trip-123', MOCK_TRIP_DETAILS_PAYLOAD);
}

export async function mockRouteDetails(page: Page) {
  await mockJsonRoute(page, '**/routes/routes/route-1', MOCK_ROUTE_PAYLOAD);
}

export async function mockUserTrips(page: Page, data: any = MOCK_TRIP_ME_EMPTY_PAYLOAD) {
  await mockJsonRoute(page, '**/trip/me/*', data);
}

export async function mockTripSubscription(page: Page) {
  await mockJsonRoute(page, '**/users/trip/*/subscribe', { message: 'Success' });
}

export async function mockSubscribedTripFeed(page: Page) {
  const { MOCK_SUBSCRIBED_TRIP_FEED_PAYLOAD } = await import('../fixtures/trip_payloads');
  await mockJsonRoute(page, '**/trip/feed*', MOCK_SUBSCRIBED_TRIP_FEED_PAYLOAD);
}

export async function mockTripCancellation(page: Page) {
  await mockJsonRoute(page, '**/users/driver/reservations/*/delete-staff-generic', { message: 'Cancelamento realizado com sucesso.' });
}
