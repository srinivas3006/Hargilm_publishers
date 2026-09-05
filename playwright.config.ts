import { defineConfig, devices } from '@playwright/test';

/**
 * E2E smoke tests. These run against a real dev server which talks to the
 * live backend — kept strictly read-only navigation (no checkout/payment
 * submission) so the suite is safe to run against production data.
 */
export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: false,
  workers: 1,
  // Dev-mode Turbopack compiles each route on first request; on a slow
  // filesystem that first compile alone can exceed the default 30s.
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 45_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
