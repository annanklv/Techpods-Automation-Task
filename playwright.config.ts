import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Each test is given 30 seconds
  timeout: 30000,

  // Each failed test is retried 1 time in order to ensure that it didn't fail due to flakiness
  retries: 1,

  // Execute tests on 1 worker
  workers: 1,

  // Disable tests to run in parallel
  fullyParallel: false
};

export default config;