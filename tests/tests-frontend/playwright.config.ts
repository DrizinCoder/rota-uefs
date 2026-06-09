// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3000';

export default defineConfig({
  // tests are located in this directory
  testDir: './',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html']] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    // start frontend from the frontend directory
    command: 'npm --prefix ../../frontend run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox e Webkit desabilitados temporariamente para debug
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
