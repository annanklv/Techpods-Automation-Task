import test from "playwright/test";
// import { LoginPage } from "../pageObjects/loginPage";
import { Hooks } from "../utils/hooks";
import { AdminPanelPage } from "../pageObjects/adminPanelPage";

test.describe("Login test cases", async () => {
  test.beforeEach(async ({ page }) => {
    const hooks: Hooks = new Hooks(page);
    await hooks.beforeEachPreconditions();
  });

  test.afterEach("Logout", async ({ page }) => {
    const loginPage: AdminPanelPage = new AdminPanelPage(page);
    loginPage.logout();
  });

  // test("Test that the user can log in.", async ({ page }) => {
  //   const loginPage: LoginPage = new LoginPage(page);
  //   await loginPage.login();
  // });
});