import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { PASSWORD, USERNAME } from "../utils/environmentVariables";
import { AdminPanelPage } from "./adminPanelPage";

class LoginPage {
  readonly page: Page;
  readonly header: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId("login-header");
    this.username = page.getByTestId("username");
    this.password = page.getByTestId("password");
    this.loginButton = page.getByTestId("submit");
    this.logoutButton = page.locator("a").getByText("Logout");
  }

  async login(): Promise<void> {
    const adminPanelPage: AdminPanelPage = new AdminPanelPage(this.page);

    // pre-conditions
    const isLoginHeaderVisible = await this.header.isVisible();
    const loginHeaderText = await this.header.textContent();
    await expect(isLoginHeaderVisible).toEqual(true);
    await expect(loginHeaderText).toEqual("Log into your account");

    // actions
    await this.username.fill(USERNAME);
    await this.password.fill(PASSWORD);
    await this.loginButton.click();

    // assertions
    await expect(this.page).toHaveURL("https://automationintesting.online/#/admin");
    await expect(adminPanelPage.navRoomsButton).toBeVisible();
    await expect(adminPanelPage.navReportButton).toBeVisible();
    await expect(adminPanelPage.navBrandingButton).toBeVisible();
    await expect(adminPanelPage.navHeader).toBeVisible();
    await expect(adminPanelPage.navMessagesButton).toBeVisible();
    await expect(adminPanelPage.NavFrontPageButton).toBeVisible();
    await expect(adminPanelPage.navLogoutButton).toBeVisible();
  };
}


export { LoginPage };