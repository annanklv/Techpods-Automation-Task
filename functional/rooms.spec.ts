import test, { expect } from "playwright/test";
import { Hooks } from "../utils/hooks";
import { RoomsPage } from "../pageObjects/roomsPage";

test.describe("Login and logout test cases", async () => {
  test.beforeEach("Login", async ({ page }) => {
    const hooks = new Hooks(page);

    await hooks.beforeEachPreconditions();
  });

  test.afterEach("Logout", async ({ page }) => {
    const hooks = new Hooks(page);

    await hooks.afterEachPostconditions();
  });

  test("Test that you can create a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(123, "suite", true, 120, [roomsPage.roomDetails.tv, roomsPage.roomDetails.views]);
    await roomsPage.assertNewRoomIsCreatedWithCorrectData("123", "Suite", "true", "120", "TV, Views");
  });

  test("Test that you can not create a room with invalid input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.fillInRoomNumber(27);
    await roomsPage.fillInPrice(1000);
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText("must be less than or equal to 999");
  });

  test("Test that you can not create a room with empty input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText("Room name must be set");
    await expect(roomsPage.dangerAlert).toContainText("must be greater than or equal to 1");
  });

  test("Test that you can update a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(377, "family", false, 200, [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]);
    await roomsPage.clickOnLastAddedRoomRow();
    await roomsPage.assertEditRoomPageDataIsCorrect("377", "Family", "false", "200", "WiFi, Refreshments", "Please enter a description for this room");
    await roomsPage.editRoomDetails(501, "single", true, 100, [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments], [roomsPage.roomDetails.radio, roomsPage.roomDetails.safe], "Updated room description");
    await roomsPage.assertEditRoomPageDataIsCorrect("501", "Single", "true", "100", "Radio, Safe", "Updated room description");
    await page.goBack();
    await roomsPage.assertNewRoomIsCreatedWithCorrectData("501", "Single", "true", "100", "Radio, Safe");
  });
});