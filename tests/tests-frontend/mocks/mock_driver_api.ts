// @ts-nocheck
import type { Page } from '@playwright/test';
import { MOCK_DRIVER_PASSENGER_LIST_PAYLOAD } from '../fixtures/driver_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockPassengerList(page: Page, onboardStatus: boolean = false) {
  await mockJsonRoute(page, '**/users/trip/*/subscribers', MOCK_DRIVER_PASSENGER_LIST_PAYLOAD(onboardStatus));
}

export async function mockManualCheckin(page: Page) {
  await mockJsonRoute(page, '**/checkin/manual', { message: 'Checkin bem sucedido.' });
}
