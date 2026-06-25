// @ts-nocheck
import type { Page } from '@playwright/test';
import { mockJsonRoute } from './mock_route_api';

export async function mockNotificationService(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'Notification', {
      value: {
        requestPermission: async () => 'granted',
        permission: 'granted',
      },
      configurable: true,
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: async () => ({}),
        ready: Promise.resolve({
          pushManager: {
            getSubscription: async () => null, // Initially not subscribed
            subscribe: async () => ({
              toJSON: () => ({
                endpoint: 'https://fcm.googleapis.com/fcm/send/fake-endpoint',
                keys: {
                  p256dh: 'fake-p256dh',
                  auth: 'fake-auth'
                }
              })
            })
          }
        })
      },
      configurable: true,
    });
  });
}

export async function mockPushSubscriptionAPI(page: Page) {
  await mockJsonRoute(page, '**/web-push/subscribe', { message: 'Subscribed successfully' });
}
