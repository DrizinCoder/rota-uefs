// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Form Validation - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should validate required fields on submission', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-validation-container';
      container.innerHTML = `
        <form data-testid="validation-form" novalidate>
          <div class="mb-4">
            <label for="req-name" class="block text-sm font-medium mb-1">Name <span class="text-red-500">*</span></label>
            <input
              type="text"
              id="req-name"
              data-testid="req-name-input"
              class="w-full px-3 py-2 border rounded-md"
              required
            />
            <span data-testid="req-name-error" class="text-red-500 text-sm hidden">Name is required</span>
          </div>
          <button type="submit" data-testid="submit-btn" class="px-4 py-2 bg-primary text-white rounded-md">
            Submit
          </button>
        </form>
      `;
      document.body.appendChild(container);

      const form = document.querySelector('[data-testid="validation-form"]');
      const nameInput = document.querySelector('[data-testid="req-name-input"]');
      const errorSpan = document.querySelector('[data-testid="req-name-error"]');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim()) {
          errorSpan.classList.remove('hidden');
          isValid = false;
        } else {
          errorSpan.classList.add('hidden');
        }

        if (isValid) {
          form.setAttribute('data-submitted', 'true');
        }
      });
    });

    const form = page.locator('form[data-testid="validation-form"]');
    const nameInput = page.locator('input[data-testid="req-name-input"]');
    const errorSpan = page.locator('span[data-testid="req-name-error"]');
    const submitBtn = page.locator('button[data-testid="submit-btn"]');

    // Submit with empty field
    await submitBtn.click();
    await expect(errorSpan).toBeVisible();
    await expect(errorSpan).toContainText('Name is required');

    // Fill in the field and submit again
    await nameInput.fill('John Doe');
    await submitBtn.click();
    await expect(errorSpan).toBeHidden();
    const submitted = await form.getAttribute('data-submitted');
    expect(submitted).toBe('true');
  });

  test('should validate email format', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-email-validation-container';
      container.innerHTML = `
        <form data-testid="email-form" novalidate>
          <div class="mb-4">
            <label for="email-field" class="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email-field"
              data-testid="email-input"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="email@example.com"
            />
            <span data-testid="email-error" class="text-red-500 text-sm hidden">Please enter a valid email address</span>
          </div>
          <button type="submit" data-testid="email-submit-btn" class="px-4 py-2 bg-primary text-white rounded-md">
            Submit
          </button>
        </form>
      `;
      document.body.appendChild(container);

      const form = document.querySelector('[data-testid="email-form"]');
      const emailInput = document.querySelector('[data-testid="email-input"]');
      const errorSpan = document.querySelector('[data-testid="email-error"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = emailInput.value.trim();

        if (!value || !emailRegex.test(value)) {
          errorSpan.classList.remove('hidden');
          form.removeAttribute('data-submitted');
        } else {
          errorSpan.classList.add('hidden');
          form.setAttribute('data-submitted', 'true');
        }
      });
    });

    const emailInput = page.locator('input[data-testid="email-input"]');
    const errorSpan = page.locator('span[data-testid="email-error"]');
    const submitBtn = page.locator('button[data-testid="email-submit-btn"]');

    // Test invalid email
    await emailInput.fill('invalid-email');
    await submitBtn.click();
    await expect(errorSpan).toBeVisible();

    // Test valid email
    await emailInput.fill('user@example.com');
    await submitBtn.click();
    await expect(errorSpan).toBeHidden();
  });

  test('should validate password length requirements', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-password-validation-container';
      container.innerHTML = `
        <form data-testid="password-form" novalidate>
          <div class="mb-4">
            <label for="pass-field" class="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="pass-field"
              data-testid="password-input"
              class="w-full px-3 py-2 border rounded-md"
              minlength="6"
            />
            <span data-testid="password-length-error" class="text-red-500 text-sm hidden">Password must be at least 6 characters</span>
            <span data-testid="password-match-error" class="text-red-500 text-sm hidden">Passwords do not match</span>
          </div>
          <div class="mb-4">
            <label for="confirm-pass" class="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirm-pass"
              data-testid="confirm-password-input"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button type="submit" data-testid="password-submit-btn" class="px-4 py-2 bg-primary text-white rounded-md">
            Register
          </button>
        </form>
      `;
      document.body.appendChild(container);

      const form = document.querySelector('[data-testid="password-form"]');
      const passwordInput = document.querySelector('[data-testid="password-input"]');
      const confirmInput = document.querySelector('[data-testid="confirm-password-input"]');
      const lengthError = document.querySelector('[data-testid="password-length-error"]');
      const matchError = document.querySelector('[data-testid="password-match-error"]');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        let isValid = true;

        lengthError.classList.add('hidden');
        matchError.classList.add('hidden');

        if (password.length < 6) {
          lengthError.classList.remove('hidden');
          isValid = false;
        }

        if (password !== confirm) {
          matchError.classList.remove('hidden');
          isValid = false;
        }

        if (isValid) {
          form.setAttribute('data-submitted', 'true');
        }
      });
    });

    const passwordInput = page.locator('input[data-testid="password-input"]');
    const confirmInput = page.locator('input[data-testid="confirm-password-input"]');
    const lengthError = page.locator('span[data-testid="password-length-error"]');
    const matchError = page.locator('span[data-testid="password-match-error"]');
    const submitBtn = page.locator('button[data-testid="password-submit-btn"]');
    const form = page.locator('form[data-testid="password-form"]');

    // Test too short password
    await passwordInput.fill('abc');
    await confirmInput.fill('abc');
    await submitBtn.click();
    await expect(lengthError).toBeVisible();

    // Test password mismatch
    await passwordInput.fill('password123');
    await confirmInput.fill('different');
    await submitBtn.click();
    await expect(matchError).toBeVisible();

    // Test valid password
    await passwordInput.fill('securePass');
    await confirmInput.fill('securePass');
    await submitBtn.click();
    await expect(lengthError).toBeHidden();
    await expect(matchError).toBeHidden();
    const submitted = await form.getAttribute('data-submitted');
    expect(submitted).toBe('true');
  });

  test('should validate custom pattern (CPF/phone format)', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-pattern-validation-container';
      container.innerHTML = `
        <form data-testid="pattern-form" novalidate>
          <div class="mb-4">
            <label for="phone-field" class="block text-sm font-medium mb-1">Phone (XX) XXXXX-XXXX</label>
            <input
              type="text"
              id="phone-field"
              data-testid="phone-input"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="(71) 91234-5678"
            />
            <span data-testid="phone-error" class="text-red-500 text-sm hidden">Invalid phone format. Use (XX) XXXXX-XXXX</span>
          </div>
          <button type="submit" data-testid="pattern-submit-btn" class="px-4 py-2 bg-primary text-white rounded-md">
            Submit
          </button>
        </form>
      `;
      document.body.appendChild(container);

      const form = document.querySelector('[data-testid="pattern-form"]');
      const phoneInput = document.querySelector('[data-testid="phone-input"]');
      const errorSpan = document.querySelector('[data-testid="phone-error"]');
      const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = phoneInput.value.trim();

        if (!value || !phoneRegex.test(value)) {
          errorSpan.classList.remove('hidden');
          form.removeAttribute('data-submitted');
        } else {
          errorSpan.classList.add('hidden');
          form.setAttribute('data-submitted', 'true');
        }
      });
    });

    const phoneInput = page.locator('input[data-testid="phone-input"]');
    const errorSpan = page.locator('span[data-testid="phone-error"]');
    const submitBtn = page.locator('button[data-testid="pattern-submit-btn"]');

    // Test invalid phone
    await phoneInput.fill('1234');
    await submitBtn.click();
    await expect(errorSpan).toBeVisible();

    // Test valid phone
    await phoneInput.fill('(71) 91234-5678');
    await submitBtn.click();
    await expect(errorSpan).toBeHidden();
  });

  test('should validate all fields together on form submission', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-full-validation-container';
      container.innerHTML = `
        <form data-testid="full-form" novalidate>
          <div class="mb-3">
            <input type="text" data-testid="full-name" placeholder="Full name" required class="w-full px-3 py-2 border rounded-md" />
            <span data-testid="full-name-err" class="text-red-500 text-sm hidden">Name is required</span>
          </div>
          <div class="mb-3">
            <input type="email" data-testid="full-email" placeholder="Email" required class="w-full px-3 py-2 border rounded-md" />
            <span data-testid="full-email-err" class="text-red-500 text-sm hidden">Valid email is required</span>
          </div>
          <button type="submit" data-testid="full-submit" class="px-4 py-2 bg-primary text-white rounded-md">Submit</button>
        </form>
      `;
      document.body.appendChild(container);

      const form = document.querySelector('[data-testid="full-form"]');
      const nameInput = document.querySelector('[data-testid="full-name"]');
      const emailInput = document.querySelector('[data-testid="full-email"]');
      const nameErr = document.querySelector('[data-testid="full-name-err"]');
      const emailErr = document.querySelector('[data-testid="full-email-err"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        nameErr.classList.add('hidden');
        emailErr.classList.add('hidden');

        if (!nameInput.value.trim()) {
          nameErr.classList.remove('hidden');
          valid = false;
        }
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
          emailErr.classList.remove('hidden');
          valid = false;
        }

        if (valid) {
          form.setAttribute('data-submitted', 'true');
        }
      });
    });

    const submitBtn = page.locator('button[data-testid="full-submit"]');
    const form = page.locator('form[data-testid="full-form"]');
    const nameErr = page.locator('span[data-testid="full-name-err"]');
    const emailErr = page.locator('span[data-testid="full-email-err"]');

    // Submit empty form
    await submitBtn.click();
    await expect(nameErr).toBeVisible();
    await expect(emailErr).toBeVisible();

    // Fill only name
    await page.fill('[data-testid="full-name"]', 'Maria');
    await submitBtn.click();
    await expect(nameErr).toBeHidden();
    await expect(emailErr).toBeVisible();

    // Fill both
    await page.fill('[data-testid="full-email"]', 'maria@test.com');
    await submitBtn.click();
    const submitted = await form.getAttribute('data-submitted');
    expect(submitted).toBe('true');
  });
});
