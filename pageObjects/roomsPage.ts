import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

type RoomType = {
  single: "Single";
  twin: "Twin";
  double: "Double";
  family: "Family",
  suite: "Suite"
};

class RoomsPage {
  readonly page: Page;
  readonly roomNumber: Locator;
  readonly type: Locator;
  readonly accessibility: Locator;
  readonly price: Locator;
  readonly roomDetails: {
    wifi: Locator;
    refreshments: Locator;
    tv: Locator;
    safe: Locator;
    radio: Locator;
    views: Locator;
  };
  readonly createButton: Locator;
  readonly lastRoomDataRow: Locator;
  readonly dangerAlert: Locator;
  readonly editButton: Locator;
  readonly editPageRoomDetails: Locator;
  readonly description: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomNumber = page.locator("#roomName");
    this.type = page.locator("#type");
    this.accessibility = page.locator("#accessible");
    this.price = page.locator("#roomPrice");
    this.roomDetails = {
      "wifi": page.locator("#wifiCheckbox"),
      "refreshments": page.locator("#refreshCheckbox"),
      "tv": page.locator("#tvCheckbox"),
      "safe": page.locator("#safeCheckbox"),
      "radio": page.locator("#radioCheckbox"),
      "views": page.locator("#viewsCheckbox")
    };
    this.createButton = page.locator("#createRoom");
    this.lastRoomDataRow = page.getByTestId("roomlisting").last();
    this.dangerAlert = page.locator("div[class='alert alert-danger']");
    this.editButton = page.locator("button").getByText("Edit");
    this.editPageRoomDetails = page.locator(".room-details");
    this.description = page.locator("#description");
    this.updateButton = page.locator("#update");
  };

  async createRoom(roomNumber: number, type: keyof RoomType, accessibility: boolean, price: number, roomDetails: Locator[]) {
    await this.fillInRoomNumber(roomNumber);
    await this.selectType(type);
    await this.selectAccessibility(accessibility);
    await this.fillInPrice(price);
    await this.checkDetails(roomDetails);
    await this.createButton.click();
  };

  async fillInRoomNumber(roomNumber: number) {
    await this.roomNumber.fill(roomNumber.toString());
  };

  async selectType(type: keyof RoomType) {
    await this.type.click();
    await this.type.selectOption(await this.page.locator(`select > option:has-text("${type}")`).innerText());
  };

  async selectAccessibility(accessibility: boolean) {
    await this.accessibility.click();
    await this.accessibility.selectOption(await this.page.locator(`select > option:has-text("${accessibility}")`).innerText());
  };

  async fillInPrice(price: number): Promise<void> {
    await this.price.fill(price.toString());
  };

  async checkDetails(roomDetails: Locator[]) {
    for (const detail of roomDetails) {
      if (!(await detail.isChecked())) {
        await detail.click();
      }
    }
  };

  async uncheckDetails(roomDetails: Locator[]) {
    for (const detail of roomDetails) {
      if (await detail.isChecked()) {
        await detail.click();
      }
    }
  };

  async fillInDescription(description: string) {
    await this.description.fill(description);
  };

  async clickTheCreateButton() {
    await this.createButton.click();
    await this.page.waitForTimeout(1000);
  };

  async assertNewRoomIsCreatedWithCorrectData(expectedRoomNumberValue: string, expectedTypeValue: string, expectedAccessibilityValue: string, expectedPriceValue: string, expectedRoomDetailsValue: string) {
    const actualRoomNumberValue = await this.lastRoomDataRow.locator("div:nth-child(1) > p").innerText();
    const actualTypeValue = await this.lastRoomDataRow.locator("div:nth-child(2) > p").innerText();
    const actualAccessiblilityValue = await this.lastRoomDataRow.locator("div:nth-child(3) > p").innerText();
    const actualPriceValue = await this.lastRoomDataRow.locator("div:nth-child(4) > p").innerText();
    const actualRoomDetailsValue = await this.lastRoomDataRow.locator("div:nth-child(5) > p").innerText();

    await expect(actualRoomNumberValue).toEqual(expectedRoomNumberValue);
    await expect(actualTypeValue).toEqual(expectedTypeValue);
    await expect(actualAccessiblilityValue).toEqual(expectedAccessibilityValue);
    await expect(actualPriceValue).toEqual(expectedPriceValue);
    await expect(actualRoomDetailsValue).toEqual(expectedRoomDetailsValue);
  };

  async clickOnLastAddedRoomRow() {
    await this.page.waitForTimeout(1000);
    await this.lastRoomDataRow.click();
  };

  async assertEditRoomPageDataIsCorrect(roomNumber: string, type: string, accessibility: string, price: string, roomDetails: string, description: string) {
    await expect(this.page).toHaveURL(/room/);
    await expect(this.editButton).toBeVisible();
    await expect(this.editPageRoomDetails).toBeVisible();
    await expect(this.editPageRoomDetails).toContainText(`Room: ${roomNumber}`);
    await expect(this.editPageRoomDetails).toContainText(`Type: ${type}`);
    await expect(this.editPageRoomDetails).toContainText(`Accessible: ${accessibility}`);
    await expect(this.editPageRoomDetails).toContainText(`Features: ${roomDetails}`);
    await expect(this.editPageRoomDetails).toContainText(`Room price: ${price}`);
    await expect(this.editPageRoomDetails).toContainText(`Description: ${description}`);
  };

  async editRoomDetails(roomNumber: number, type: keyof RoomType, accessibility: boolean, price: number, roomDetailsToUncheck: Locator[], roomDetailsToCheck: Locator[], description: string) {
    await this.editButton.click();
    await this.fillInRoomNumber(roomNumber);
    await this.selectType(type);
    await this.selectAccessibility(accessibility);
    await this.fillInPrice(price);
    await this.uncheckDetails(roomDetailsToUncheck);
    await this.checkDetails(roomDetailsToCheck);
    await this.fillInDescription(description);
    await this.updateButton.click();
  };
}

export { RoomsPage };