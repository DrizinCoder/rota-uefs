// @ts-nocheck
import type { Page } from '@playwright/test';

export async function seedLocalStorage(page: Page, entries: Record<string, string>) {
  await page.addInitScript((storageEntries) => {
    Object.entries(storageEntries).forEach(([key, value]) => {
      window.localStorage.setItem(key, value);
    });
  }, entries);
}

export async function clearLocalStorage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
}
