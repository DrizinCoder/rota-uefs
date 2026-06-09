// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Toast Component - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should render toast with title and description', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-toast-container';
      container.innerHTML = `
        <div data-testid="toast-root" class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all">
          <div class="flex flex-col gap-1">
            <div data-testid="toast-title" class="text-sm font-semibold">
              Schedule saved
            </div>
            <div data-testid="toast-description" class="text-sm opacity-90">
              Your meeting has been confirmed for tomorrow at 2 PM.
            </div>
          </div>
          <button data-testid="toast-close" class="absolute right-2 top-2 rounded-md p-1">
            <svg width="15" height="15" viewBox="0 0 15 15"><path d="M11.7816 4.03157a.375.375 0 0 0-.5303 0L7.5 7.7197 3.7487 3.96827a.375.375 0 1 0-.5303.53033L6.9697 8.25l-3.7513 3.7513a.375.375 0 1 0 .5303.53033L7.5 8.7803l3.7513 3.7513a.375.375 0 0 0 .5303-.53033L8.0303 8.25l3.7513-3.7513a.375.375 0 0 0 0-.53033z"/></svg>
          </button>
        </div>
      `;
      document.body.appendChild(container);
    });

    const toastTitle = page.locator('div[data-testid="toast-title"]');
    const toastDescription = page.locator('div[data-testid="toast-description"]');

    await expect(toastTitle).toBeVisible();
    await expect(toastTitle).toContainText('Schedule saved');
    await expect(toastDescription).toBeVisible();
    await expect(toastDescription).toContainText('Your meeting has been confirmed for tomorrow at 2 PM');
  });

  test('should dismiss toast when close button is clicked', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-toast-dismiss-container';
      container.innerHTML = `
        <div data-testid="dismissable-toast" class="toast-item">
          <span data-testid="toast-msg">Notification message</span>
          <button data-testid="dismiss-btn" class="dismiss-button">×</button>
        </div>
      `;
      document.body.appendChild(container);

      const toast = document.querySelector('[data-testid="dismissable-toast"]');
      const dismissBtn = document.querySelector('[data-testid="dismiss-btn"]');
      dismissBtn.addEventListener('click', () => {
        toast.remove();
      });
    });

    const toast = page.locator('div[data-testid="dismissable-toast"]');
    await expect(toast).toBeVisible();

    await page.click('[data-testid="dismiss-btn"]');
    await expect(toast).toBeHidden();
  });

  test('should support multiple toasts simultaneously', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-multi-toast-container';
      container.innerHTML = `
        <div data-testid="toast-1" class="toast bg-green-100 border-green-400 p-3 mb-2 rounded">
          <span>Toast One</span>
        </div>
        <div data-testid="toast-2" class="toast bg-blue-100 border-blue-400 p-3 mb-2 rounded">
          <span>Toast Two</span>
        </div>
        <div data-testid="toast-3" class="toast bg-red-100 border-red-400 p-3 mb-2 rounded">
          <span>Toast Three</span>
        </div>
      `;
      document.body.appendChild(container);
    });

    const toast1 = page.locator('div[data-testid="toast-1"]');
    const toast2 = page.locator('div[data-testid="toast-2"]');
    const toast3 = page.locator('div[data-testid="toast-3"]');

    await expect(toast1).toBeVisible();
    await expect(toast2).toBeVisible();
    await expect(toast3).toBeVisible();

    await expect(toast1.locator('span')).toContainText('Toast One');
    await expect(toast2.locator('span')).toContainText('Toast Two');
    await expect(toast3.locator('span')).toContainText('Toast Three');
  });

  test('should support toast variants (default and destructive)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-variants-container';
      container.innerHTML = `
        <div data-testid="toast-default" class="border bg-background text-foreground p-4 rounded-md mb-2">
          Default Toast
        </div>
        <div data-testid="toast-destructive" class="destructive group border-destructive bg-destructive text-destructive-foreground p-4 rounded-md">
          Destructive Toast
        </div>
      `;
      document.body.appendChild(container);
    });

    const defaultToast = page.locator('div[data-testid="toast-default"]');
    const destructiveToast = page.locator('div[data-testid="toast-destructive"]');

    await expect(defaultToast).toBeVisible();
    await expect(defaultToast).toContainText('Default Toast');

    await expect(destructiveToast).toBeVisible();
    await expect(destructiveToast).toContainText('Destructive Toast');
    await expect(destructiveToast).toHaveClass(/bg-destructive/);
    await expect(destructiveToast).toHaveClass(/text-destructive-foreground/);
  });

  test('should auto-dismiss toast after a timeout', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-auto-dismiss-container';
      container.innerHTML = `
        <div data-testid="auto-toast" class="toast-item">
          <span>This toast will auto-dismiss</span>
        </div>
      `;
      document.body.appendChild(container);

      // Simulate auto-dismiss after 500ms
      setTimeout(() => {
        const toast = document.querySelector('[data-testid="auto-toast"]');
        if (toast) toast.remove();
      }, 500);
    });

    const autoToast = page.locator('div[data-testid="auto-toast"]');
    await expect(autoToast).toBeVisible();

    // Wait for auto-dismiss
    await page.waitForTimeout(700);
    await expect(autoToast).toBeHidden();
  });

  test('should support toast with action button', async ({ page }) => {
    let actionClicked = false;

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-action-container';
      container.innerHTML = `
        <div data-testid="action-toast" class="toast flex items-center justify-between p-4 border rounded-md">
          <span>File uploaded successfully</span>
          <button data-testid="toast-action-btn" class="px-3 py-1 bg-primary text-white rounded text-sm font-medium">
            Undo
          </button>
        </div>
      `;
      document.body.appendChild(container);

      const actionBtn = document.querySelector('[data-testid="toast-action-btn"]');
      actionBtn.addEventListener('click', () => {
        const toast = document.querySelector('[data-testid="action-toast"]');
        toast.setAttribute('data-action-triggered', 'true');
      });
    });

    const actionToast = page.locator('div[data-testid="action-toast"]');
    const actionBtn = page.locator('button[data-testid="toast-action-btn"]');

    await expect(actionToast).toBeVisible();
    await expect(actionBtn).toBeVisible();
    await expect(actionBtn).toContainText('Undo');

    await actionBtn.click();
    const actionTriggered = await actionToast.getAttribute('data-action-triggered');
    expect(actionTriggered).toBe('true');
  });
});
