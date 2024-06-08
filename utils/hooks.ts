import { Page } from "playwright";
import { LoginPage } from "../pageObjects/loginPage";
import { AdminPanelPage } from "../pageObjects/adminPanelPage";

class Hooks {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  };

  async beforeEachPreconditions(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    const adminPanelPage = new AdminPanelPage(this.page);

    console.log("Before each start");
    await this.page.goto(adminPanelPage.url);
    await loginPage.login();
    console.log("Before each end");
  };

  async afterEachPostconditions(): Promise<void> {
    const adminPanelPage = new AdminPanelPage(this.page);

    console.log("After each start.");
    await adminPanelPage.logout();
    await this.page.close();
    console.log("After each end.");
  };
}

export { Hooks };