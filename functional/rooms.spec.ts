import test, { expect } from "playwright/test";
import { Hooks } from "../utils/hooks";
import { RoomsPage } from "../pageObjects/roomsPage";
import testData from "../fixtures/testData.json";

test.describe("Rooms test cases", async () => {
  test.beforeEach(async ({ page }) => {
    const hooks = new Hooks(page);

    await hooks.beforeEachPreconditions();
  });

  test.afterEach(async ({ page }) => {
    const hooks = new Hooks(page);

    await hooks.afterEachPostconditions();
  });

  test("Test that you can create a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(
      testData.validRooms[0].roomNumber,
      testData.validRooms[0].type,
      testData.validRooms[0].accessibility,
      testData.validRooms[0].price,
      [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]
    );

    await roomsPage.assertNewRoomIsCreatedWithCorrectData(
      testData.expectedRoomValues[0].roomNumber,
      testData.expectedRoomValues[0].type,
      testData.expectedRoomValues[0].accessibility,
      testData.expectedRoomValues[0].price,
      "WiFi, Refreshments"
    );
  });

  test("Test that you can not create a room with invalid input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.fillInRoomNumber(testData.validRooms[0].roomNumber);
    await roomsPage.fillInPrice(testData.invalidRooms.price);
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText("must be less than or equal to 999");
  });

  test("Test that you can not create a room with empty input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Simply click the Create button, because by default inputs are empty
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText("Room name must be set");
    await expect(roomsPage.dangerAlert).toContainText("must be greater than or equal to 1");
  });

  test("Test that you can update a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(
      testData.validRooms[1].roomNumber,
      testData.validRooms[1].type,
      testData.validRooms[1].accessibility,
      testData.validRooms[1].price,
      [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio]
    );

    await roomsPage.clickOnLastAddedRoomRow();

    await roomsPage.assertEditRoomPageDataIsCorrect(
      testData.expectedRoomValues[1].roomNumber,
      testData.expectedRoomValues[1].type,
      testData.expectedRoomValues[1].accessibility,
      testData.expectedRoomValues[1].price,
      "TV, Radio",
      testData.expectedRoomValues[1].defaultDescription!
    );

    await roomsPage.editRoomDetails(
      testData.validRooms[2].roomNumber,
      testData.validRooms[2].type,
      testData.validRooms[2].accessibility,
      testData.validRooms[2].price,
      [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio],
      [roomsPage.roomDetails.radio, roomsPage.roomDetails.safe],
      testData.validRooms[2].description!
    );

    await roomsPage.assertEditRoomPageDataIsCorrect(
      testData.expectedRoomValues[2].roomNumber,
      testData.expectedRoomValues[2].type,
      testData.expectedRoomValues[2].accessibility,
      testData.expectedRoomValues[2].price,
      "Radio, Safe",
      testData.expectedRoomValues[2].description!
    );

    await page.goBack();

    await roomsPage.assertNewRoomIsCreatedWithCorrectData(
      testData.expectedRoomValues[2].roomNumber,
      testData.expectedRoomValues[2].type,
      testData.expectedRoomValues[2].accessibility,
      testData.expectedRoomValues[2].price,
      "Radio, Safe"
    );
  });

  // Fails due to a bug in the application
  test("Test that you can delete rooms.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(
      testData.validRooms[3].roomNumber,
      testData.validRooms[3].type,
      testData.validRooms[3].accessibility,
      testData.validRooms[3].price,
      [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]);

    const initialNumberOfRooms = await roomsPage.getNumberOfRooms();
    const roomDataAfterAddingTheRoom = await roomsPage.getLastRoomData();

    await roomsPage.deleteLastAddedRoom();

    const numberOfRoomsAfterDeletion = await roomsPage.getNumberOfRooms();
    const roomDataAfterDeletingTheRoom = await roomsPage.getLastRoomData();

    expect(numberOfRoomsAfterDeletion).toEqual(initialNumberOfRooms - 1);
    expect(roomDataAfterDeletingTheRoom).not.toEqual(roomDataAfterAddingTheRoom);
  });

  test("Test that you can view the available rooms in the system.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(testData.validRooms[0].roomNumber, testData.validRooms[0].type, testData.validRooms[0].accessibility, testData.validRooms[0].price, [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]);
    await roomsPage.createRoom(testData.validRooms[1].roomNumber, testData.validRooms[1].type, testData.validRooms[1].accessibility, testData.validRooms[1].price, [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio]);

    await roomsPage.getAllAvailableRooms();
  });
});