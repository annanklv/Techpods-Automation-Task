import { Page } from "playwright";
import { LoginPage } from "../tests/pageObjects/loginPage";
import { AdminPanelPage } from "../tests/pageObjects/adminPanelPage";

class Hooks {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  };

  async beforeEachPreconditions(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    const adminPanelPage = new AdminPanelPage(this.page);

    await this.page.goto(adminPanelPage.url);
    await loginPage.login();
  };

  async afterEachPostconditions(): Promise<void> {
    const adminPanelPage = new AdminPanelPage(this.page);

    await adminPanelPage.logout();
    await this.page.close();
  };
}

export { Hooks };