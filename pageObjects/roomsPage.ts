import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

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
  readonly roomDataRow: Locator;
  readonly deleteRoomButton: Locator;

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
    this.roomDataRow = page.getByTestId("roomlisting");
    this.deleteRoomButton = page.locator("span[class*='roomDelete']");
  };

  async createRoom(roomNumber: number, type: string, accessibility: boolean, price: number, roomDetails: Locator[]): Promise<void> {
    await this.fillInRoomNumber(roomNumber);
    await this.selectType(type);
    await this.selectAccessibility(accessibility);
    await this.fillInPrice(price);
    await this.checkDetails(roomDetails);
    await this.createButton.click();
    await this.page.waitForTimeout(1000);
  };

  async fillInRoomNumber(roomNumber: number): Promise<void> {
    await this.roomNumber.fill(roomNumber.toString());
  };

  async selectType(type: string): Promise<void> {
    await this.type.click();
    await this.type.selectOption(await this.page.locator(`select > option:has-text("${type}")`).innerText());
  };

  async selectAccessibility(accessibility: boolean): Promise<void> {
    await this.accessibility.click();
    await this.accessibility.selectOption(await this.page.locator(`select > option:has-text("${accessibility}")`).innerText());
  };

  async fillInPrice(price: number): Promise<void> {
    await this.price.fill(price.toString());
  };

  async checkDetails(roomDetails: Locator[]): Promise<void> {
    for (const detail of roomDetails) {
      if (!(await detail.isChecked())) {
        await detail.click();
      }
    }
  };

  async uncheckDetails(roomDetails: Locator[]): Promise<void> {
    for (const detail of roomDetails) {
      if (await detail.isChecked()) {
        await detail.click();
      }
    }
  };

  async fillInDescription(description: string): Promise<void> {
    await this.description.fill(description);
  };

  async clickTheCreateButton(): Promise<void> {
    await this.createButton.click();
    await this.page.waitForTimeout(1000);
  };

  async assertNewRoomIsCreatedWithCorrectData(expectedRoomNumberValue: string, expectedTypeValue: string, expectedAccessibilityValue: string, expectedPriceValue: string, expectedRoomDetailsValue: string): Promise<void> {
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

  async clickOnLastAddedRoomRow(): Promise<void> {
    await this.lastRoomDataRow.click();
  };

  async assertEditRoomPageDataIsCorrect(roomNumber: string, type: string, accessibility: string, price: string, roomDetails: string, description: string): Promise<void> {
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

  async editRoomDetails(roomNumber: number, type: string, accessibility: boolean, price: number, roomDetailsToUncheck: Locator[], roomDetailsToCheck: Locator[], description: string): Promise<void> {
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

  async getNumberOfRooms(): Promise<number> {
    return await this.roomDataRow.count()
  };

  async getLastRoomData(): Promise<string> {
    return await this.lastRoomDataRow.innerText();
  };

  async deleteLastAddedRoom(): Promise<void> {
    await this.deleteRoomButton.last().click();
    await this.page.waitForTimeout(1000);
  };

  async getAllAvailableRooms(): Promise<void> {
    const rooms = await this.roomDataRow.all();
    if (rooms.length > 0) {
      for (const room of rooms) {
        const roomNumber = await room.locator("div:nth-child(1) > p").innerText();
        const type = await room.locator("div:nth-child(2) > p").innerText();
        const accessiblility = await room.locator("div:nth-child(3) > p").innerText();
        const price = await room.locator("div:nth-child(4) > p").innerText();
        const roomDetails = await room.locator("div:nth-child(5) > p").innerText();
        console.log(`Room Number: ${roomNumber}, Type: ${type}, Accessibility: ${accessiblility}, Price: ${price}, Room details: ${roomDetails}`);
      }
    } else {
      console.log("No available rooms in the system.");
    }
  };
}

export { RoomsPage };