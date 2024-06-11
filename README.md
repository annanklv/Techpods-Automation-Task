## techpods-automation-task
This is a project that tests the create, read, update and delete actions for rooms in a booking system.

## Concepts Included

* Page Object pattern
* Common web page interaction methods
* Commonly used test utility classes
* Custom reporter
* Translations

## Completed tasks

* Developed automated tests (Happy path + negative tests) for the create, read, update and delete actions.
* Implemented the automated tests with fixture data, page objects, action methods and reporting.
* Added a mechanism to enable the tests and assertions to pass when application language is changed.
* Created a bug report for the bugs found during manual and automated testing.

## What I didn't do due to lack of time

* Load authenticated state of the tests. This eliminates the need to authenticate in every test and speeds up test execution.

## Tools

* TypeScript
* Playwright

## Installation Instructions:

To start the project successfully, you need to install all packages first.
You can do that by running the command `npm install`.

## Usage

First thing you should do is to create a `.env` file in the root directory of the project and add there the login credentials and application language you will use:

```
ADMIN_USERNAME=<username>
ADMIN_PASSWORD=<password>
APP_LANGUAGE=English
```

To execute tests navigate to `techpods-automation-task` directory and run:

* `npm run test:all` to execute tests in all available suites.
* `npm run test:rooms` to execute the tests only in the `rooms.spec.ts` file.

For the purpose of this task there is a single spec file, so it doesn't matter which command you choose - results will be the same.

## Configuration details

Tests are configured to run in a headless mode. If you want to watch test execution, open the `playwright.config.ts` file and change the headless property to true:

```
use: {
  headless: true, // Set to false if you want to see the browser actions
}
```

You can focus/execute only one or a few tests. When there are focused tests, only they run.

```
test.only("Test that you can create a room.", async ({ page }) => {
  // some code here
});
```

Currently, tests will run only on chromium browser. If you want to run the tests on different browsers, feel free to uncomment any or all of the commented out code in the projects block in `playwright.config.ts` file.

```
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
]
```

If you want to run the tests in all browsers and in parallel, uncomment the code above and set the workers to 6 for example since we have 6 test cases and we run them on 3 browsers. Also set the fullyParallel property to true:

```
workers: 6,
fullyParallel: true
```
