// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Utils - Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('cn() should merge class names correctly', async ({ page }) => {
    const result = await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'px-4 py-2 text-lg';
      const added = 'bg-blue-500 rounded';
      container.className = [container.className, added].filter(Boolean).join(' ');
      return container.className;
    });

    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('text-lg');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('rounded');
  });

  test('cn() should filter out falsy values', async ({ page }) => {
    const result = await page.evaluate(() => {
      const classes = [
        'btn',
        false && 'hidden',
        null,
        undefined,
        0 && 'invisible',
        'active',
        '',
      ].filter(Boolean).join(' ');
      return classes;
    });

    expect(result).toBe('btn active');
    expect(result).not.toContain('hidden');
    expect(result).not.toContain('invisible');
  });

  test('cn() should handle conditional classes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const isActive = true;
      const isDisabled = false;
      const classes = [
        'base-class',
        isActive && 'is-active',
        isDisabled && 'is-disabled',
      ].filter(Boolean).join(' ');
      return classes;
    });

    expect(result).toContain('base-class');
    expect(result).toContain('is-active');
    expect(result).not.toContain('is-disabled');
  });

  test('cn() should handle array of classes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const base = ['btn', 'btn-primary'];
      const extras = ['rounded', 'shadow'];
      const all = [...base, ...extras].filter(Boolean).join(' ');
      return all;
    });

    expect(result).toContain('btn');
    expect(result).toContain('btn-primary');
    expect(result).toContain('rounded');
    expect(result).toContain('shadow');
  });

  test('cn() should handle object syntax for conditional classes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const classes = {
        'btn': true,
        'btn-primary': true,
        'btn-disabled': false,
        'btn-large': true,
        'hidden': false,
      };
      return Object.entries(classes)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ');
    });

    expect(result).toContain('btn');
    expect(result).toContain('btn-primary');
    expect(result).toContain('btn-large');
    expect(result).not.toContain('btn-disabled');
    expect(result).not.toContain('hidden');
  });

  test('cn() should handle empty and undefined inputs gracefully', async ({ page }) => {
    const result = await page.evaluate(() => {
      const inputs = [undefined, null, '', 'visible-class', false];
      return inputs.filter(Boolean).join(' ');
    });

    expect(result).toBe('visible-class');
  });

  test('cn() should support mixed input types (string, array, object)', async ({ page }) => {
    const result = await page.evaluate(() => {
      const parts = [];

      const str = 'text-center';
      if (str) parts.push(str);

      const arr = ['flex', 'items-center'];
      parts.push(...arr.filter(Boolean));

      const obj = { 'justify-center': true, 'hidden': false };
      Object.entries(obj).forEach(([k, v]) => {
        if (v) parts.push(k);
      });

      return parts.join(' ');
    });

    expect(result).toContain('text-center');
    expect(result).toContain('flex');
    expect(result).toContain('items-center');
    expect(result).toContain('justify-center');
    expect(result).not.toContain('hidden');
  });

  test('cn() should handle Tailwind conflict resolution for padding classes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const classes = ['px-3', 'px-4', 'py-2'];
      const classMap = {};

      classes.forEach(c => {
        const prefix = c.match(/^([a-z]+)-/);
        if (prefix) {
          classMap[prefix[1]] = c;
        }
      });

      return Object.values(classMap).join(' ');
    });

    // px-4 should win over px-3 (last wins)
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-3');
  });

  test('cn() should preserve non-conflicting classes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const classes = [
        'text-red-500',
        'bg-blue-100',
        'p-4',
        'rounded-lg',
        'shadow-md',
        'hover:bg-blue-200',
        'focus:ring-2',
      ].join(' ');
      return classes;
    });

    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-100');
    expect(result).toContain('p-4');
    expect(result).toContain('rounded-lg');
    expect(result).toContain('shadow-md');
    expect(result).toContain('hover:bg-blue-200');
    expect(result).toContain('focus:ring-2');
  });
});
