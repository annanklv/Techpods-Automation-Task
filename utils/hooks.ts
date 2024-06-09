import { Page, chromium } from "playwright";
import { LoginPage } from "../pageObjects/loginPage";
import { AdminPanelPage } from "../pageObjects/adminPanelPage";

class Hooks {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  };

  async beforeEachPreconditions(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    const adminPanelPage = new AdminPanelPage(this.page);

    console.log("Loggin in.");
    await this.page.goto(adminPanelPage.url);
    await loginPage.login();
    console.log("Successfully logged in.");
  };

  async afterEachPostconditions(): Promise<void> {
    const adminPanelPage = new AdminPanelPage(this.page);

    console.log("Logging out.");
    await adminPanelPage.logout();
    await this.page.close();
    console.log("Successfully logged out.");
  };
}

export { Hooks };