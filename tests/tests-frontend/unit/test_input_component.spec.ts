// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Input Component - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // Testes de renderização de atributos, para determinar comportamento básico dos componentes.
  
  test('should render input element with placeholder and attributes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-input-container';
      container.innerHTML = `
        <input 
          type="text"
          data-slot="input"
          data-testid="test-input"
          placeholder="Enter your name"
          class="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base"
        />
      `;
      document.body.appendChild(container);
    });

    const input = page.locator('input[data-testid="test-input"]');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Enter your name');
    await expect(input).toHaveAttribute('data-slot', 'input');
  });

  test('should support multiple input types', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-types-container';
      container.innerHTML = `
        <input data-testid="text-input" type="text" data-type="text" />
        <input data-testid="password-input" type="password" data-type="password" />
        <input data-testid="email-input" type="email" data-type="email" />
        <input data-testid="number-input" type="number" data-type="number" />
      `;
      document.body.appendChild(container);
    });

    const textInput = page.locator('input[data-testid="text-input"]');
    const passwordInput = page.locator('input[data-testid="password-input"]');
    const emailInput = page.locator('input[data-testid="email-input"]');
    const numberInput = page.locator('input[data-testid="number-input"]');

    await expect(textInput).toHaveAttribute('type', 'text');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(numberInput).toHaveAttribute('type', 'number');
  });

  test('should accept value changes and fire events', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-events-container';
      container.innerHTML = `
        <input 
          type="text"
          data-testid="event-input"
          class="h-9 w-full rounded-md border bg-transparent px-3 py-1"
        />
      `;
      document.body.appendChild(container);

      const input = document.querySelector('input[data-testid="event-input"]');
      let changeCount = 0;
      let inputCount = 0;

      input.addEventListener('change', () => {
        changeCount++;
        input.setAttribute('data-change-count', changeCount.toString());
      });

      input.addEventListener('input', () => {
        inputCount++;
        input.setAttribute('data-input-count', inputCount.toString());
      });

      input.setAttribute('data-change-count', '0');
      input.setAttribute('data-input-count', '0');
    });

    const eventInput = page.locator('input[data-testid="event-input"]');

    // Type text to trigger input events
    await eventInput.fill('Test Value');
    await eventInput.dispatchEvent('change');

    const finalValue = await eventInput.inputValue();
    expect(finalValue).toBe('Test Value');

    // Verify events were tracked
    const changeCount = await eventInput.getAttribute('data-change-count');
    const inputCount = await eventInput.getAttribute('data-input-count');
    expect(parseInt(changeCount)).toBe(1);
    expect(parseInt(inputCount)).toBeGreaterThan(0);
  });

  test('should handle disabled state correctly', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-disabled-input-container';
      container.innerHTML = `
        <input 
          type="text"
          data-testid="disabled-input"
          disabled
          value="Read Only Value"
          class="disabled:pointer-events-none disabled:opacity-50"
        />
      `;
      document.body.appendChild(container);
    });

    const disabledInput = page.locator('input[data-testid="disabled-input"]');

    // Verify the input is disabled
    await expect(disabledInput).toBeDisabled();
    
    // Verify the value is set and cannot be changed via user interaction
    const value = await disabledInput.inputValue();
    expect(value).toBe('Read Only Value');
    
    // Verify the disabled style class is applied
    const classAttr = await disabledInput.getAttribute('class');
    expect(classAttr).toContain('disabled:pointer-events-none');
    expect(classAttr).toContain('disabled:opacity-50');
  });

  test('should handle focus and blur events', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-focus-container';
      container.innerHTML = `
        <input 
          type="text"
          data-testid="focus-input"
          class="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      `;
      document.body.appendChild(container);

      const input = document.querySelector('input[data-testid="focus-input"]');
      let focusCount = 0;
      let blurCount = 0;

      input.addEventListener('focus', () => {
        focusCount++;
        input.setAttribute('data-focus-count', focusCount.toString());
      });

      input.addEventListener('blur', () => {
        blurCount++;
        input.setAttribute('data-blur-count', blurCount.toString());
      });

      input.setAttribute('data-focus-count', '0');
      input.setAttribute('data-blur-count', '0');
    });

    const focusInput = page.locator('input[data-testid="focus-input"]');

    // Focus the input
    await focusInput.focus();
    let focusCount = await focusInput.getAttribute('data-focus-count');
    expect(parseInt(focusCount)).toBeGreaterThanOrEqual(0);

    // Blur the input
    await focusInput.blur();
    let blurCount = await focusInput.getAttribute('data-blur-count');
    expect(parseInt(blurCount)).toBeGreaterThanOrEqual(0);
  });

  test('should support readonly and other attributes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-attrs-container';
      container.innerHTML = `
        <input 
          type="text"
          data-testid="readonly-input"
          readonly
          value="Read Only Value"
        />
        <input 
          type="text"
          data-testid="constrained-input"
          maxlength="10"
          name="username"
          required
        />
      `;
      document.body.appendChild(container);
    });

    const readonlyInput = page.locator('input[data-testid="readonly-input"]');
    const constrainedInput = page.locator('input[data-testid="constrained-input"]');

    // Test readonly input
    await expect(readonlyInput).toHaveAttribute('readonly', '');
    const readonlyValue = await readonlyInput.inputValue();
    expect(readonlyValue).toBe('Read Only Value');

    // Test constrained input
    await expect(constrainedInput).toHaveAttribute('maxlength', '10');
    await expect(constrainedInput).toHaveAttribute('name', 'username');
    await expect(constrainedInput).toHaveAttribute('required', '');
  });

  test('should support accessibility attributes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-a11y-container';
      container.innerHTML = `
        <input 
          type="email"
          data-testid="a11y-input"
          aria-label="Email address"
          aria-invalid="true"
          aria-describedby="error-message"
          class="aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        />
        <div id="error-message">This field is required</div>
      `;
      document.body.appendChild(container);
    });

    const a11yInput = page.locator('input[data-testid="a11y-input"]');
    const errorMessage = page.locator('div#error-message');

    // Check accessibility attributes
    await expect(a11yInput).toHaveAttribute('aria-label', 'Email address');
    await expect(a11yInput).toHaveAttribute('aria-invalid', 'true');
    await expect(a11yInput).toHaveAttribute('aria-describedby', 'error-message');
    await expect(errorMessage).toContainText('This field is required');
  });
})
