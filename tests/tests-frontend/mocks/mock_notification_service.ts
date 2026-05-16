// @ts-nocheck
import type { Page } from '@playwright/test';

export async function mockNotificationService(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'Notification', {
      value: class NotificationMock {
        static permission = 'granted';
        static async requestPermission() {
          return 'granted';
        }
      },
      configurable: true,
    });
  });
}
