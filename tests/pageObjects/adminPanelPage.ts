import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { LoginPage } from "./loginPage";
import translations from "../../fixtures/translations.json";

class AdminPanelPage {
  readonly page: Page;
  readonly english: any;
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
    this.english = translations["en-EN"];
    this.url = "https://automationintesting.online/#/admin";
    this.navRoomsButton = page.getByRole('link', { name: `${this.english.roomsNavButton}` });
    this.navReportButton = page.getByRole("link", { name: `${this.english.reportNavButton}` });
    this.navBrandingButton = page.getByRole("link", { name: `${this.english.brandingNavButton}` });
    this.navHeader = page.getByRole("link", { name: `${this.english.navHeader}` });
    this.navMessagesButton = page.locator("nav a > i");
    this.NavFrontPageButton = page.getByRole("link", { name: `${this.english.frontPageNavButton}` });
    this.navLogoutButton = page.getByRole("link", { name: `${this.english.logoutNavButton}` });
  };

  async logout(): Promise<void> {
    const loginPage = new LoginPage(this.page);

    await this.navLogoutButton.click();
    await expect(loginPage.loginButton).toBeVisible();
  };
}

export { AdminPanelPage };