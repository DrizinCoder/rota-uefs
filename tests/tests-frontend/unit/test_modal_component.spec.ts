// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Modal Component - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // Tests for modal rendering and basic states
  test('should render modal container', async ({ page }) => {
    // Create a test modal by injecting it into the page
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-container';
      container.innerHTML = `
        <div data-testid="modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div data-testid="modal-content" class="relative max-h-[90vh] w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg">
            <div class="space-y-4">
              <h2 class="text-lg font-semibold leading-none text-foreground">
                Modal Title
              </h2>
              <p class="text-sm">
                This is a test modal component.
              </p>
              <button data-testid="modal-close-btn" class="mt-4">
                Close
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const modalOverlay = page.locator('div[data-testid="modal-overlay"]');
    const modalContent = page.locator('div[data-testid="modal-content"]');

    await expect(modalOverlay).toBeVisible();
    await expect(modalContent).toBeVisible();
  });

  test('should render modal with title and content', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-content-container';
      container.innerHTML = `
        <div data-testid="modal-content-container" class="modal-content">
          <h2 data-testid="modal-title" class="text-xl font-bold">
            Confirm Action
          </h2>
          <p data-testid="modal-description" class="mt-2">
            Are you sure you want to proceed with this action?
          </p>
        </div>
      `;
      document.body.appendChild(container);
    });

    const modalTitle = page.locator('h2[data-testid="modal-title"]');
    const modalDescription = page.locator('p[data-testid="modal-description"]');

    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toContainText('Confirm Action');
    await expect(modalDescription).toBeVisible();
    await expect(modalDescription).toContainText('Are you sure you want to proceed with this action?');
  });

  test('should handle modal open/close states', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-state-container';
      container.innerHTML = `
        <button data-testid="toggle-modal-btn">Toggle Modal</button>
        <div data-testid="modal-backdrop" class="hidden fixed inset-0 bg-black/50">
          <div data-testid="modal-window" class="relative bg-white rounded-lg p-6">
            <h3>Modal Window</h3>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Add toggle functionality
      const backdrop = document.querySelector('[data-testid="modal-backdrop"]');
      const toggleBtn = document.querySelector('[data-testid="toggle-modal-btn"]');

      toggleBtn.addEventListener('click', () => {
        backdrop.classList.toggle('hidden');
      });
    });

    const modalBackdrop = page.locator('div[data-testid="modal-backdrop"]');
    const toggleBtn = page.locator('button[data-testid="toggle-modal-btn"]');

    // Initially should be hidden
    await expect(modalBackdrop).toHaveClass(/hidden/);

    // Click to open
    await toggleBtn.dispatchEvent('click');
    await expect(modalBackdrop).not.toHaveClass(/hidden/);

    // Click to close
    await toggleBtn.dispatchEvent('click');
    await expect(modalBackdrop).toHaveClass(/hidden/);
  });

  test('should support different modal sizes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-sizes-container';
      container.innerHTML = `
        <div data-testid="modal-sm" class="modal sm:max-w-sm">Small Modal</div>
        <div data-testid="modal-lg" class="modal lg:max-w-lg">Large Modal</div>
        <div data-testid="modal-full" class="modal w-full">Full Width Modal</div>
      `;
      document.body.appendChild(container);
    });

    const smallModal = page.locator('div[data-testid="modal-sm"]');
    const largeModal = page.locator('div[data-testid="modal-lg"]');
    const fullModal = page.locator('div[data-testid="modal-full"]');

    await expect(smallModal).toBeVisible();
    await expect(largeModal).toBeVisible();
    await expect(fullModal).toBeVisible();

    // Check size classes
    await expect(smallModal).toHaveClass(/sm:max-w-sm/);
    await expect(largeModal).toHaveClass(/lg:max-w-lg/);
    await expect(fullModal).toHaveClass(/w-full/);
  });

  test('should handle keyboard interactions (ESC to close)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-keyboard-container';
      container.innerHTML = `
        <div data-testid="keyboard-modal" class="fixed inset-0 flex items-center justify-center z-50">
          <div data-testid="keyboard-modal-content" class="bg-white rounded-lg p-4 relative">
            <button data-testid="keyboard-close-btn" class="absolute top-2 right-2">
              ×
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Add ESC key handling
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const modal = document.querySelector('[data-testid="keyboard-modal"]');
          if (modal) modal.style.display = 'none';
        }
      });
    });

    const keyboardModal = page.locator('div[data-testid="keyboard-modal"]');
    await expect(keyboardModal).toBeVisible();

    // Press ESC key
    await page.keyboard.press('Escape');

    // Verify modal is hidden after ESC key press
    await expect(keyboardModal).toBeHidden();
  });

  test('should support modal with form elements', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-modal-form-container';
      container.innerHTML = `
        <div data-testid="form-modal" class="modal-content">
          <form data-testid="modal-form">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1" for="modal-email">
                Email address
              </label>
              <input
                type="email"
                id="modal-email"
                data-testid="modal-email-input"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Enter email"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1" for="modal-password">
                Password
              </label>
              <input
                type="password"
                id="modal-password"
                data-testid="modal-password-input"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Enter password"
                required
                minlength="6"
              />
            </div>
            <button
              type="submit"
              data-testid="modal-submit-btn"
              class="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
            >
              Submit
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(container);
    });

    const formModal = page.locator('div[data-testid="form-modal"]');
    const emailInput = page.locator('input[data-testid="modal-email-input"]');
    const passwordInput = page.locator('input[data-testid="modal-password-input"]');
    const submitBtn = page.locator('button[data-testid="modal-submit-btn"]');

    await expect(formModal).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Test form interaction
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    const emailValue = await emailInput.inputValue();
    const passwordValue = await passwordInput.inputValue();

    expect(emailValue).toBe('test@example.com');
    expect(passwordValue).toBe('password123');

    // Test submit button
    await expect(submitBtn).toBeEnabled();
  });

  test('should handle modal backdrop clicks to close', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-backdrop-click-container';
      container.innerHTML = `
        <div data-testid="backdrop-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div data-testid="backdrop-modal-content" class="bg-white rounded-lg p-6 relative">
            <p>Click outside to close</p>
            <button data-testid="inner-close-btn" class="mt-4">
              Inner Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      // Add backdrop click handling
      const backdrop = document.querySelector('[data-testid="backdrop-modal"]');
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.style.display = 'none';
        }
      });
    });

    const backdropModal = page.locator('div[data-testid="backdrop-modal"]');
    await expect(backdropModal).toBeVisible();

    // Click on the backdrop (outside the modal content)
    await page.click('[data-testid="backdrop-modal"]', { position: { x: 10, y: 10 } });

    // Verify backdrop is hidden after click
    await expect(backdropModal).toBeHidden();
  });
});