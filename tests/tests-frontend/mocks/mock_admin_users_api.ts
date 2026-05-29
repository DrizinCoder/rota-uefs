// @ts-nocheck

import type { Page } from '@playwright/test';

import {
  ADMIN_CREATE_ERROR_RESPONSE,
  ADMIN_CREATE_SUCCESS_RESPONSE,
  PENDING_STAFF_RESPONSE,
  STAFF_APPROVE_ERROR_RESPONSE,
  STAFF_APPROVE_SUCCESS_RESPONSE,
} from '../fixtures/admin_users_payloads';
import { mockJsonRoute } from './mock_route_api';

export async function mockPendingStaffList(page: Page) {
  await mockJsonRoute(page, '**/users/staff/', PENDING_STAFF_RESPONSE);
}

export async function mockStaffApprovalSuccess(page: Page) {
  await mockJsonRoute(page, '**/users/staff/accept/**', STAFF_APPROVE_SUCCESS_RESPONSE, 200);
}

export async function mockStaffApprovalFailure(page: Page) {
  await mockJsonRoute(page, '**/users/staff/accept/**', STAFF_APPROVE_ERROR_RESPONSE, 500);
}

export async function mockAdminCreationSuccess(page: Page) {
  await mockJsonRoute(page, '**/admin/', ADMIN_CREATE_SUCCESS_RESPONSE, 201);
}

export async function mockAdminCreationFailure(page: Page) {
  await mockJsonRoute(page, '**/admin/', ADMIN_CREATE_ERROR_RESPONSE, 400);
}