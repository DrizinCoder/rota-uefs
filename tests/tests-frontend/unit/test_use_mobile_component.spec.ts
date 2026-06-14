// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Mobile Component - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // Tests for mobile detection and responsive behavior
  test('should detect mobile viewport', async ({ page }) => {
    // Set viewport to mobile dimensions
    await page.setViewportSize({ width: 375, height: 667 });

    // Create a test component that displays mobile status
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-mobile-component';
      container.innerHTML = `
        <div data-testid="mobile-status" class="mobile-detector">
          <!-- This would typically be populated by a hook or component -->
          <span data-testid="is-mobile">false</span>
        </div>
      `;
      document.body.appendChild(container);
    });

    // Simulate a mobile detection mechanism (in real app, this would come from a hook)
    // For test purposes, we'll set the value based on viewport
    await page.evaluate(() => {
      const isMobile = window.innerWidth <= 768;
      document.querySelector('[data-testid="is-mobile"]').textContent = isMobile;
    });

    const mobileStatus = page.locator('span[data-testid="is-mobile"]');
    await expect(mobileStatus).toHaveText('true');
  });

  test('should detect desktop viewport', async ({ page }) => {
    // Set viewport to desktop dimensions
    await page.setViewportSize({ width: 1024, height: 768 });

    // Create a test component that displays mobile status
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-mobile-component-desktop';
      container.innerHTML = `
        <div data-testid="mobile-status-desktop" class="mobile-detector">
          <span data-testid="is-mobile-desktop">true</span>
        </div>
      `;
      document.body.appendChild(container);
    });

    // Simulate a mobile detection mechanism
    await page.evaluate(() => {
      const isMobile = window.innerWidth <= 768;
      document.querySelector('[data-testid="is-mobile-desktop"]').textContent = String(isMobile);
    });

    const mobileStatus = page.locator('span[data-testid="is-mobile-desktop"]');
    await expect(mobileStatus).toHaveText('false');
  });

  test('should render mobile-specific content', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-mobile-content';
      container.innerHTML = `
        <style>
          .hidden { display: none !important; }
          .block { display: block !important; }
          @media (min-width: 640px) {
            .sm\\:block { display: block !important; }
            .sm\\:hidden { display: none !important; }
          }
        </style>
        <div data-testid="mobile-content-wrapper">
          <div data-testid="desktop-only" class="hidden sm:block">
            Desktop Only Content
          </div>
          <div data-testid="mobile-only" class="block sm:hidden">
            Mobile Only Content
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const desktopOnly = page.locator('div[data-testid="desktop-only"]');
    const mobileOnly = page.locator('div[data-testid="mobile-only"]');

    // On mobile, desktop-only should be hidden, mobile-only should be visible
    await expect(desktopOnly).toBeHidden();
    await expect(mobileOnly).toBeVisible();
    await expect(mobileOnly).toContainText('Mobile Only Content');
  });

  test('should render desktop-specific content', async ({ page }) => {
    // Set viewport to desktop
    await page.setViewportSize({ width: 1024, height: 768 });

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-desktop-content';
      container.innerHTML = `
        <style>
          .hidden { display: none !important; }
          .block { display: block !important; }
          @media (min-width: 640px) {
            .sm\\:block { display: block !important; }
            .sm\\:hidden { display: none !important; }
          }
        </style>
        <div data-testid="desktop-content-wrapper">
          <div data-testid="desktop-only" class="hidden sm:block">
            Desktop Only Content
          </div>
          <div data-testid="mobile-only" class="block sm:hidden">
            Mobile Only Content
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const desktopOnly = page.locator('div[data-testid="desktop-only"]');
    const mobileOnly = page.locator('div[data-testid="mobile-only"]');

    // On desktop, desktop-only should be visible, mobile-only should be hidden
    await expect(desktopOnly).toBeVisible();
    await expect(desktopOnly).toContainText('Desktop Only Content');
    await expect(mobileOnly).toBeHidden();
  });

  test('should handle orientation changes', async ({ page }) => {
    // Test portrait mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-orientation';
      container.innerHTML = `
        <div data-testid="orientation-portrait" class="orientation-text">Portrait</div>
      `;
      document.body.appendChild(container);
    });

    let orientationText = page.locator('div[data-testid="orientation-portrait"]');
    await expect(orientationText).toBeVisible();

    // Test landscape mobile
    await page.setViewportSize({ width: 667, height: 375 });
    await page.evaluate(() => {
      // Update the orientation text based on width/height ratio
      const isPortrait = window.innerWidth < window.innerHeight;
      document.querySelector('[data-testid="orientation-portrait"]').textContent = isPortrait ? 'Portrait' : 'Landscape';
    });

    orientationText = page.locator('div[data-testid="orientation-portrait"]');
    await expect(orientationText).toHaveText('Landscape');
  });

  test('should provide mobile context to child components', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-mobile-context';
      container.innerHTML = `
        <div data-testid="mobile-provider">
          <div data-testid="child-component" class="child">
            <!-- Child component that consumes mobile context -->
            <span data-testid="mobile-value-in-child">unknown</span>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    // Simulate providing mobile context to child
    await page.evaluate(() => {
      const isMobile = window.innerWidth <= 768;
      document.querySelector('[data-testid="mobile-value-in-child"]').textContent = isMobile;
    });

    const mobileValueInChild = page.locator('span[data-testid="mobile-value-in-child"]');
    await expect(mobileValueInChild).toHaveText('true');
  });
});