import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  reporter: [
    ['list', { printSteps: true }],
    ["html", { open: "never" }],
    ["./reporters/basic-reporter.ts"]
  ],

  // Each test is given 30 seconds
  timeout: 30000,

  // Each failed test is retried 1 time in order to ensure that it didn't fail due to flakiness
  retries: 1,

  // Execute tests on 1 worker
  workers: 1,

  fullyParallel: false,

  projects: [
    // Test against desktop browsers
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium' },
    },
    // {
    //   name: 'Desktop Firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'Desktop WebKit',
    //   use: { browserName: 'webkit' },
    // }
  ],

  // Configure other global settings here
  use: {
    headless: true, // Set to false if you want to see the browser actions
  },
};

export default config;