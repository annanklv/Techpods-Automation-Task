import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { PASSWORD, USERNAME } from "../utils/environmentVariables";
import { AdminPanelPage } from "./adminPanelPage";
import translations from "../fixtures/translations.json";

class LoginPage {
  readonly page: Page;
  readonly header: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly english;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId("login-header");
    this.username = page.getByTestId("username");
    this.password = page.getByTestId("password");
    this.loginButton = page.getByTestId("submit");
    this.logoutButton = page.locator("a").getByText("Logout");
    this.english = translations["en-EN"];
  }

  async login(): Promise<void> {
    const adminPanelPage: AdminPanelPage = new AdminPanelPage(this.page);

    // pre-conditions
    const isLoginHeaderVisible = await this.header.isVisible();
    const loginHeaderText = await this.header.textContent();
    await expect(isLoginHeaderVisible).toEqual(true);
    await expect(loginHeaderText).toEqual(this.english.loginHeader);

    // actions
    await this.username.fill(USERNAME);
    await this.password.fill(PASSWORD);
    await this.loginButton.click();

    // assertions
    await expect(this.page).toHaveURL("https://automationintesting.online/#/admin");
    await expect(adminPanelPage.navRoomsButton).toBeVisible();
    await expect(adminPanelPage.navRoomsButton).toHaveText(this.english.roomsNavButton);
    await expect(adminPanelPage.navReportButton).toBeVisible();
    await expect(adminPanelPage.navReportButton).toHaveText(this.english.reportNavButton);
    await expect(adminPanelPage.navBrandingButton).toBeVisible();
    await expect(adminPanelPage.navBrandingButton).toHaveText(this.english.brandingNavButton);
    await expect(adminPanelPage.navHeader).toBeVisible();
    await expect(adminPanelPage.navHeader).toHaveText(this.english.navHeader);
    await expect(adminPanelPage.navMessagesButton).toBeVisible();
    await expect(adminPanelPage.NavFrontPageButton).toBeVisible();
    await expect(adminPanelPage.NavFrontPageButton).toHaveText(this.english.frontPageNavButton);
    await expect(adminPanelPage.navLogoutButton).toBeVisible();
    await expect(adminPanelPage.navLogoutButton).toHaveText(this.english.logoutNavButton);
  };
}


export { LoginPage };