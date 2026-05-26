// @ts-nocheck

import type { Page } from '@playwright/test';

import {
  ADMIN_HOME_RESPONSE,
  BUS_CREATED_RESPONSE,
  BUS_DUPLICATE_ERROR_RESPONSE,
  BUS_OPTIONS,
  DRIVER_OPTIONS,
  ROUTE_CREATED_RESPONSE,
  ROUTE_OPTIONS,
  TRIP_INVALID_SCHEDULE_ERROR_RESPONSE,
} from '../fixtures/fleet_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockAdminHomeInfo(page: Page) {
  await mockJsonRoute(page, '**/admin/home_info**', ADMIN_HOME_RESPONSE);
}

export async function mockBusCreationSuccess(page: Page) {
  await mockJsonRoute(page, '**/fleet**', BUS_CREATED_RESPONSE, 201);
}

export async function mockBusCreationFailure(page: Page) {
  await mockJsonRoute(page, '**/fleet**', BUS_DUPLICATE_ERROR_RESPONSE, 400);
}

export async function mockTripCreationDependencies(page: Page) {
  await mockJsonRoute(page, '**/users/driver/', {
    data: DRIVER_OPTIONS,
  });

  await mockJsonRoute(page, '**/routes/routes/', {
    data: ROUTE_OPTIONS,
  });

  await mockJsonRoute(page, '**/fleet**', {
    data: BUS_OPTIONS,
  });
}

export async function mockTripCreationSuccess(page: Page) {
  await mockJsonRoute(page, '**/trip/', ROUTE_CREATED_RESPONSE, 201);
}

export async function mockTripCreationFailure(page: Page) {
  await mockJsonRoute(page, '**/trip/', TRIP_INVALID_SCHEDULE_ERROR_RESPONSE, 400);
}