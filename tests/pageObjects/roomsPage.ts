import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { APP_LABEL } from "../../utils/environmentVariables";

class RoomsPage {
  readonly page: Page;
  readonly roomNumber: Locator;
  readonly type: Locator;
  readonly accessibility: Locator;
  readonly price: Locator;
  readonly roomDetails: { [key: string]: Locator };
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
      "WiFi": page.locator("#wifiCheckbox"),
      "Refreshments": page.locator("#refreshCheckbox"),
      "TV": page.locator("#tvCheckbox"),
      "Safe": page.locator("#safeCheckbox"),
      "Radio": page.locator("#radioCheckbox"),
      "VSiews": page.locator("#viewsCheckbox")
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

  async createRooms(values: Room[]): Promise<void> {
    for (const value of values) {
      await this.fillInRoomNumber(value.roomNumber);
      await this.selectType(value.type);
      await this.selectAccessibility(value.accessibility);
      await this.fillInPrice(value.price);
      await this.checkDetails(value.roomDetails);
      await this.createButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async fillInRoomNumber(roomNumber: string): Promise<void> {
    await this.roomNumber.fill(roomNumber);
  };

  async selectType(type: string): Promise<void> {
    await this.type.click();
    await this.type.selectOption(await this.page.locator(`select > option:has-text("${type}")`).innerText());
  };

  async selectAccessibility(accessibility: string): Promise<void> {
    await this.accessibility.click();
    await this.accessibility.selectOption(await this.page.locator(`select > option:has-text("${accessibility}")`).innerText());
  };

  async fillInPrice(price: number): Promise<void> {
    await this.price.fill(price.toString());
  };

  async checkDetails(roomDetails: RoomDetail[]): Promise<void> {
    for (const roomDetail of roomDetails) {
      const roomDetailLocator = this.roomDetails[roomDetail];

      if (!(await roomDetailLocator.isChecked())) {
        await roomDetailLocator.click();
      }
    }
  };

  async uncheckDetails(roomDetails: RoomDetail[]): Promise<void> {
    for (const roomDetail of roomDetails) {
      const roomDetailLocator = this.roomDetails[roomDetail];

      if (await roomDetailLocator.isChecked()) {
        await roomDetailLocator.click();
      }
    }
  };

  async fillInDescription(description?: string): Promise<void> {
    await this.description.fill(description!);
  };

  async clickTheCreateButton(): Promise<void> {
    await this.createButton.click();
    await this.page.waitForTimeout(1000);
  };

  async assertLastRoomsDataIsCorrect(
    expectedRoomNumberValue: string,
    expectedTypeValue: string,
    expectedAccessibilityValue: string,
    expectedPriceValue: number,
    expectedRoomDetailsValue: string
  ): Promise<void> {
    const actualRoomNumberValue = await this.lastRoomDataRow.locator("div:nth-child(1) > p").innerText();
    const actualTypeValue = await this.lastRoomDataRow.locator("div:nth-child(2) > p").innerText();
    const actualAccessiblilityValue = await this.lastRoomDataRow.locator("div:nth-child(3) > p").innerText();
    const actualPriceValue = await this.lastRoomDataRow.locator("div:nth-child(4) > p").innerText();
    const actualRoomDetailsValue = await this.lastRoomDataRow.locator("div:nth-child(5) > p").innerText();

    await expect(actualRoomNumberValue).toEqual(expectedRoomNumberValue);
    await expect(actualTypeValue).toEqual(expectedTypeValue);
    await expect(actualAccessiblilityValue).toEqual(expectedAccessibilityValue);
    await expect(actualPriceValue).toEqual(expectedPriceValue.toString());
    await expect(actualRoomDetailsValue).toEqual(expectedRoomDetailsValue);
  };

  async clickOnLastAddedRoomRow(): Promise<void> {
    await this.lastRoomDataRow.click();
  };

  async assertEditRoomPageDataIsCorrect(room: Room): Promise<void> {
    await expect(this.page).toHaveURL(/room/);
    await expect(this.editButton).toBeVisible();
    await expect(this.editPageRoomDetails).toBeVisible();
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.roomLabel}: ${room.roomNumber}`);
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.typeLabel}: ${room.type}`);
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.accessibleLabel}: ${room.accessibility}`);
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.featuresLabel}: ${room.roomDetails.join(", ")}`);
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.roomPriceLabel}: ${room.price}`);
    await expect(this.editPageRoomDetails).toContainText(`${APP_LABEL.descriptionLabel}: ${room.description}`);
  };

  async editRoomDetails(room: Room, roomDetailsToUncheck: RoomDetail[]): Promise<void> {
    await this.editButton.click();
    await this.fillInRoomNumber(room.roomNumber);
    await this.selectType(room.type);
    await this.selectAccessibility(room.accessibility);
    await this.fillInPrice(room.price);
    await this.uncheckDetails(roomDetailsToUncheck);
    await this.checkDetails(room.roomDetails);
    await this.fillInDescription(room.description);
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

  async getAllAvailableRooms(): Promise<Room[]> {
    const rooms: Room[] = [];
    const roomDataRows = await this.roomDataRow.all();

    for (const roomDataRow of roomDataRows) {
      rooms.push({
        roomNumber: await roomDataRow.locator("div:nth-child(1) > p").innerText(),
        type: (await roomDataRow.locator("div:nth-child(2) > p").innerText()).toLocaleLowerCase(),
        accessibility: await roomDataRow.locator("div:nth-child(3) > p").innerText(),
        price: Number(await roomDataRow.locator("div:nth-child(4) > p").innerText()),
        roomDetails: (await roomDataRow.locator("div:nth-child(5) > p")
          .innerText())
          .split(",")
          .map(roomDetail => <RoomDetail>roomDetail.trim())
      });
    }

    return rooms;
  };
}

export { RoomsPage };

export interface Room {
  roomNumber: string;
  type: string;
  accessibility: string;
  price: number;
  roomDetails: RoomDetail[];
  description?: string;
}

export type RoomDetail = "WiFi" | "Refreshments" | "TV" | "Safe" | "Radio" | "Views";