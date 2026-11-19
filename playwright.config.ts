import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

import { STORAGE_STATE } from './src/config/paths';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.ci,
  retries: env.ci ? 2 : 0,
  workers: env.ci ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          UI_BASE_URL: env.ui.baseUrl,
          API_BASE_URL: env.api.baseUrl,
          NODE_VERSION: process.version,
        },
      },
    ],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.api.baseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: env.ui.baseUrl },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: env.ui.baseUrl, storageState: STORAGE_STATE },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], baseURL: env.ui.baseUrl, storageState: STORAGE_STATE },
    },
  ],
});
