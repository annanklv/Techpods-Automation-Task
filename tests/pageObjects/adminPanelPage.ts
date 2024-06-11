import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { LoginPage } from "./loginPage";
import { APP_LABEL } from "../../utils/environmentVariables";

class AdminPanelPage {
  readonly page: Page;
  readonly url: string;
  readonly navRoomsButton: Locator;
  readonly navReportButton: Locator;
  readonly navBrandingButton: Locator;
  readonly navHeader: Locator;
  readonly navMessagesButton: Locator;
  readonly NavFrontPageButton: Locator;
  readonly navLogoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = "https://automationintesting.online/#/admin";
    this.navRoomsButton = page.getByRole('link', { name: `${APP_LABEL.roomsNavButton}` });
    this.navReportButton = page.getByRole("link", { name: `${APP_LABEL.reportNavButton}` });
    this.navBrandingButton = page.getByRole("link", { name: `${APP_LABEL.brandingNavButton}` });
    this.navHeader = page.getByRole("link", { name: `${APP_LABEL.navHeader}` });
    this.navMessagesButton = page.locator("nav a > i");
    this.NavFrontPageButton = page.getByRole("link", { name: `${APP_LABEL.frontPageNavButton}` });
    this.navLogoutButton = page.getByRole("link", { name: `${APP_LABEL.logoutNavButton}` });
  };

  async logout(): Promise<void> {
    const loginPage = new LoginPage(this.page);

    await this.navLogoutButton.click();
    await expect(loginPage.loginButton).toBeVisible();
  };
}

export { AdminPanelPage };