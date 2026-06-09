// @ts-nocheck

import type { Page } from '@playwright/test';

import {
  BUS_OPTIONS,
  CREATED_ROUTE_OPTION,
  DEFAULT_ROUTE_OPTION,
  DRIVER_OPTIONS,
  ROUTE_CREATE_FAILURE_RESPONSE,
  ROUTE_CREATE_SUCCESS_RESPONSE,
  ROUTE_OPTIONS_FOR_TRIP,
  TRIP_CREATE_FAILURE_RESPONSE,
  TRIP_CREATE_SUCCESS_RESPONSE,
} from '../fixtures/admin_trips_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockRouteCatalog(page: Page, routes = ROUTE_OPTIONS_FOR_TRIP) {
  await mockJsonRoute(page, '**/routes/routes/', {
    data: routes,
  });
}

export async function mockRouteCreationSuccess(page: Page) {
  await mockJsonRoute(page, '**/routes/create', ROUTE_CREATE_SUCCESS_RESPONSE, 201);
}

export async function mockRouteCreationFailure(page: Page) {
  await mockJsonRoute(page, '**/routes/create', ROUTE_CREATE_FAILURE_RESPONSE, 400);
}

export async function mockTripDependencies(page: Page, routes = [DEFAULT_ROUTE_OPTION]) {
  await mockJsonRoute(page, '**/users/driver/', {
    data: DRIVER_OPTIONS,
  });

  await mockJsonRoute(page, '**/routes/routes/', {
    data: routes,
  });

  await mockJsonRoute(page, '**/fleet/', {
    data: BUS_OPTIONS,
  });
}

export async function mockTripCreationSuccess(page: Page) {
  await mockJsonRoute(page, '**/trip/', TRIP_CREATE_SUCCESS_RESPONSE, 201);
}

export async function mockTripCreationFailure(page: Page) {
  await mockJsonRoute(page, '**/trip/', TRIP_CREATE_FAILURE_RESPONSE, 400);
}