import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  expect: {timeout: 10000},
  fullyParallel: false,
  workers: 2,
  use: {baseURL: 'http://localhost:3000', viewport: {width: 1440, height: 1000}, trace: 'retain-on-failure'},
  reporter: [['list'], ['html', {open: 'never'}]],
});
