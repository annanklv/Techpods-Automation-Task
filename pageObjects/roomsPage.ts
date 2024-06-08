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
    wifiCheckbox: Locator;
    refreshmentsCheckbox: Locator;
    tvCheckbox: Locator;
    safeCheckbox: Locator;
    radioCheckbox: Locator;
    viewsCheckbox: Locator;
  };
  readonly createButton: Locator;
  readonly lastDataRow: Locator;
  readonly dangerAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomNumber = page.getByTestId("roomName");
    this.type = page.locator("#type");
    this.accessibility = page.locator("#accessible");
    this.price = page.locator("#roomPrice");
    this.roomDetails = {
      "wifiCheckbox": page.locator("#wifiCheckbox"),
      "refreshmentsCheckbox": page.locator("#refreshCheckbox"),
      "tvCheckbox": page.locator("#tvCheckbox"),
      "safeCheckbox": page.locator("#safeCheckbox"),
      "radioCheckbox": page.locator("#radioCheckbox"),
      "viewsCheckbox": page.locator("#viewsCheckbox")
    };
    this.createButton = page.locator("#createRoom");
    this.lastDataRow = page.getByTestId("roomlisting").last();
    this.dangerAlert = page.locator("div[class='alert alert-danger']");
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
    console.log("check details started");
    for (const detail of roomDetails) {
      if (!(await detail.isChecked())) {
        await detail.click();
      }
    }
    console.log("check details ended");
  };

  async clickTheCreateButton() {
    await this.createButton.click();
  };

  async assertNewRoomIsCreatedWithCorrectData(expectedRoomNumberValue: string, expectedTypeValue: string, expectedAccessibilityValue: string, expectedPriceValue: string, expectedRoomDetailsValue: string) {
    const actualRoomNumberValue = await this.lastDataRow.locator("div:nth-child(1) > p").innerText();
    const actualTypeValue = await this.lastDataRow.locator("div:nth-child(2) > p").innerText();
    const actualAccessiblilityValue = await this.lastDataRow.locator("div:nth-child(3) > p").innerText();
    const actualPriceValue = await this.lastDataRow.locator("div:nth-child(4) > p").innerText();
    const actualRoomDetailsValue = await this.lastDataRow.locator("div:nth-child(5) > p").innerText();

    await expect(actualRoomNumberValue).toEqual(expectedRoomNumberValue);
    await expect(actualTypeValue).toEqual(expectedTypeValue);
    await expect(actualAccessiblilityValue).toEqual(expectedAccessibilityValue);
    await expect(actualPriceValue).toEqual(expectedPriceValue);
    await expect(actualRoomDetailsValue).toEqual(expectedRoomDetailsValue);
  };
}

export { RoomsPage };