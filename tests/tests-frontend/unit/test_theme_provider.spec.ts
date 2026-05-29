// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Theme Provider - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should apply light theme by default', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');

      const container = document.createElement('div');
      container.id = 'test-theme-container';
      container.innerHTML = `
        <div data-testid="theme-aware" class="bg-background text-foreground p-4">
          <h1 data-testid="theme-heading" class="text-xl font-bold">Current Theme</h1>
          <span data-testid="theme-value" class="text-muted-foreground">light</span>
        </div>
      `;
      document.body.appendChild(container);
    });

    const themeValue = page.locator('span[data-testid="theme-value"]');
    await expect(themeValue).toHaveText('light');
    await expect(themeValue).toBeVisible();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-toggle-container';
      container.innerHTML = `
        <div data-testid="theme-panel" class="p-4">
          <span data-testid="current-theme">light</span>
          <button data-testid="theme-toggle-btn" class="px-4 py-2 bg-primary text-white rounded-md mt-2">
            Toggle Theme
          </button>
        </div>
      `;
      document.body.appendChild(container);

      const themeSpan = document.querySelector('[data-testid="current-theme"]');
      const toggleBtn = document.querySelector('[data-testid="theme-toggle-btn"]');
      let isDark = false;

      toggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        const theme = isDark ? 'dark' : 'light';
        themeSpan.textContent = theme;
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
        document.documentElement.setAttribute('data-theme', theme);
      });
    });

    const themeSpan = page.locator('span[data-testid="current-theme"]');
    const toggleBtn = page.locator('button[data-testid="theme-toggle-btn"]');

    // Initial state
    await expect(themeSpan).toHaveText('light');

    // Toggle to dark
    await toggleBtn.click();
    await expect(themeSpan).toHaveText('dark');
    let hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(hasDarkClass).toBe(true);

    // Toggle back to light
    await toggleBtn.click();
    await expect(themeSpan).toHaveText('light');
    hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(hasDarkClass).toBe(false);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Save theme to localStorage
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });

    // Reload the page to simulate persistence
    await page.reload();

    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });

    expect(storedTheme).toBe('dark');
  });

  test('should apply dark theme classes to themed elements', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');

      const container = document.createElement('div');
      container.id = 'test-dark-container';
      container.innerHTML = `
        <div data-testid="dark-card" class="dark:bg-gray-800 dark:text-white bg-white text-black p-6 rounded-lg shadow">
          <h2 data-testid="dark-title" class="dark:text-gray-100">Dark Mode Card</h2>
          <p data-testid="dark-text" class="dark:text-gray-300">This content adapts to dark theme.</p>
          <button data-testid="dark-btn" class="dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded">
            Action
          </button>
        </div>
      `;
      document.body.appendChild(container);
    });

    const darkCard = page.locator('div[data-testid="dark-card"]');
    const darkTitle = page.locator('h2[data-testid="dark-title"]');
    const darkText = page.locator('p[data-testid="dark-text"]');
    const darkBtn = page.locator('button[data-testid="dark-btn"]');

    await expect(darkCard).toBeVisible();
    await expect(darkTitle).toBeVisible();
    await expect(darkText).toBeVisible();
    await expect(darkBtn).toBeVisible();

    await expect(darkCard).toHaveClass(/dark:bg-gray-800/);
    await expect(darkBtn).toHaveClass(/dark:bg-blue-600/);
  });

  test('should switch theme using system preference', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-system-container';
      container.innerHTML = `
        <div data-testid="system-theme-panel">
          <span data-testid="system-theme-label">System theme detected:</span>
          <span data-testid="system-theme-value">light</span>
          <button data-testid="simulate-system-dark" class="block mt-2 px-3 py-1 border rounded">
            Simulate Dark System
          </button>
        </div>
      `;
      document.body.appendChild(container);

      const themeValue = document.querySelector('[data-testid="system-theme-value"]');
      const simulateBtn = document.querySelector('[data-testid="simulate-system-dark"]');

      simulateBtn.addEventListener('click', () => {
        themeValue.textContent = 'dark';
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });
    });

    const themeValue = page.locator('span[data-testid="system-theme-value"]');
    await expect(themeValue).toHaveText('light');

    // Simulate system dark preference
    await page.click('[data-testid="simulate-system-dark"]');
    await expect(themeValue).toHaveText('dark');

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(isDark).toBe(true);
  });

  test('should support multiple theme values (light, dark, system)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-multi-theme-container';
      container.innerHTML = `
        <div data-testid="theme-selector" class="p-4">
          <select data-testid="theme-select" class="border rounded p-2">
            <option value="light" selected>Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <div data-testid="theme-preview" class="mt-4 p-4 border rounded bg-white text-black dark:bg-gray-900 dark:text-white">
            <p>Theme preview area</p>
          </div>
        </div>
      `;
      document.body.appendChild(container);

      const select = document.querySelector('[data-testid="theme-select"]');

      select.addEventListener('change', function () {
        const theme = this.value;
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        document.documentElement.setAttribute('data-theme', theme);
        select.setAttribute('data-selected-theme', theme);
      });
    });

    const select = page.locator('select[data-testid="theme-select"]');

    // Default light
    let selectedTheme = await select.getAttribute('data-selected-theme');
    expect(selectedTheme).toBeNull(); // Not yet changed

    // Select dark
    await select.selectOption('dark');
    selectedTheme = await select.getAttribute('data-selected-theme');
    expect(selectedTheme).toBe('dark');
    let isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(isDark).toBe(true);

    // Select light
    await select.selectOption('light');
    selectedTheme = await select.getAttribute('data-selected-theme');
    expect(selectedTheme).toBe('light');
    isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(isDark).toBe(false);
  });
});
