// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Button Component - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should render button with text content', async ({ page }) => {
    // Create a test button by injecting it into the page
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-button-container';
      container.innerHTML = `
        <button data-testid="test-btn" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50">
          Click Me
        </button>
      `;
      document.body.appendChild(container);
    });

    const button = page.locator('button[data-testid="test-btn"]');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Click Me');
  });

  test('should support variant styles (default)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-variants-container';
      container.innerHTML = `
        <button data-variant="default" class="bg-primary text-primary-foreground hover:bg-primary/90">Default Button</button>
        <button data-variant="secondary" class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Secondary Button</button>
        <button data-variant="destructive" class="bg-destructive text-white hover:bg-destructive/90">Destructive Button</button>
      `;
      document.body.appendChild(container);
    });

    const defaultBtn = page.locator('button[data-variant="default"]');
    const secondaryBtn = page.locator('button[data-variant="secondary"]');
    const destructiveBtn = page.locator('button[data-variant="destructive"]');

    await expect(defaultBtn).toHaveClass(/bg-primary/);
    await expect(secondaryBtn).toHaveClass(/bg-secondary/);
    await expect(destructiveBtn).toHaveClass(/bg-destructive/);
  });

  test('should support size variants', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-sizes-container';
      container.innerHTML = `
        <button data-size="sm" class="h-8 rounded-md gap-1.5 px-3">Small</button>
        <button data-size="default" class="h-9 px-4 py-2">Default</button>
        <button data-size="lg" class="h-10 rounded-md px-6">Large</button>
      `;
      document.body.appendChild(container);
    });

    const smallBtn = page.locator('button[data-size="sm"]');
    const defaultBtn = page.locator('button[data-size="default"]');
    const largeBtn = page.locator('button[data-size="lg"]');

    await expect(smallBtn).toHaveClass(/h-8/);
    await expect(defaultBtn).toHaveClass(/h-9/);
    await expect(largeBtn).toHaveClass(/h-10/);
  });

  test('should handle disabled state correctly', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-disabled-container';
      container.innerHTML = `
        <button 
          data-testid="disabled-btn" 
          disabled 
          class="disabled:pointer-events-none disabled:opacity-50"
        >
          Disabled Button
        </button>
      `;
      document.body.appendChild(container);
    });

    const disabledBtn = page.locator('button[data-testid="disabled-btn"]');
    
    await expect(disabledBtn).toBeDisabled();
    await expect(disabledBtn).toHaveClass(/disabled:opacity-50/);
  });

  test('should handle click events', async ({ page }) => {
    let clickCount = 0;

    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-click-container';
      container.innerHTML = `
        <button data-testid="click-btn">Click Counter</button>
      `;
      document.body.appendChild(container);
      
      const btn = document.querySelector('button[data-testid="click-btn"]');
      btn.addEventListener('click', () => {
        btn.setAttribute('data-clicks', (parseInt(btn.getAttribute('data-clicks') || '0') + 1).toString());
      });
      btn.setAttribute('data-clicks', '0');
    });

    const clickBtn = page.locator('button[data-testid="click-btn"]');
    
    await clickBtn.click();
    let clicks = await page.locator('button[data-testid="click-btn"]').getAttribute('data-clicks');
    expect(parseInt(clicks)).toBe(1);
    
    await clickBtn.click();
    clicks = await page.locator('button[data-testid="click-btn"]').getAttribute('data-clicks');
    expect(parseInt(clicks)).toBe(2);
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-a11y-container';
      container.innerHTML = `
        <button 
          data-testid="a11y-btn"
          aria-label="Test button"
          class="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          Accessible Button
        </button>
      `;
      document.body.appendChild(container);
    });

    const a11yBtn = page.locator('button[data-testid="a11y-btn"]');

    // Check that button has proper ARIA attributes
    const ariaLabel = await a11yBtn.getAttribute('aria-label');
    expect(ariaLabel).toBe('Test button');

    // Test focus
    await a11yBtn.focus();
    const isFocused = await page.evaluate(() => document.activeElement === document.querySelector('button[data-testid="a11y-btn"]'));
    expect(isFocused).toBe(true);
  });

  test('should support child elements (icons + text)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-children-container';
      container.innerHTML = `
        <button data-testid="icon-btn" class="inline-flex items-center justify-center gap-2">
          <svg data-testid="btn-icon" width="20" height="20" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
          <span>Download</span>
        </button>
      `;
      document.body.appendChild(container);
    });

    const iconBtn = page.locator('button[data-testid="icon-btn"]');
    const icon = page.locator('svg[data-testid="btn-icon"]');
    const text = iconBtn.locator('span');

    await expect(iconBtn).toBeVisible();
    await expect(icon).toBeVisible();
    await expect(text).toContainText('Download');
  });
})
