import test, { expect } from "playwright/test";
import { RoomsPage } from "../pageObjects/roomsPage";
import testData from "../../fixtures/testData.json";
import translations from "../../fixtures/translations.json";
import { Hooks } from "../../utils/hooks";

test.describe("Rooms test cases", async () => {
  const english = translations["en-EN"];

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
      testData.validRoomInputData[0].roomNumber,
      english.singleRoom,
      english.accessibilityTrue,
      testData.validRoomInputData[0].price,
      [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]
    );

    await roomsPage.assertNewRoomIsCreatedWithCorrectData(
      testData.expectedRoomValues[0].roomNumber,
      english.expectedRoomOutputData[0].type,
      english.expectedRoomOutputData[0].accessibility,
      testData.expectedRoomValues[0].price,
      `${english.wifi}, ${english.refreshments}`
    );
  });

  test("Test that you can not create a room with invalid input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.fillInRoomNumber(testData.validRoomInputData[0].roomNumber);
    await roomsPage.fillInPrice(testData.invalidRoomInputData.price);
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText(english.invalidPriceErrorMessage);
  });

  test("Test that you can not create a room with empty input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Simply click the Create button, because by default inputs are empty
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText(english.emptyRoomNumberErrorMessage);
    await expect(roomsPage.dangerAlert).toContainText(english.emptyPriceErrorMessage);
  });

  test("Test that you can update a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(
      testData.validRoomInputData[1].roomNumber,
      english.familyRoom,
      english.accessibilityFalse,
      testData.validRoomInputData[1].price,
      [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio]
    );

    await roomsPage.clickOnLastAddedRoomRow();

    await roomsPage.assertEditRoomPageDataIsCorrect(
      testData.validRoomInputData[1].roomNumber.toString(),
      english.expectedRoomOutputData[1].type,
      english.expectedRoomOutputData[1].accessibility,
      testData.expectedRoomValues[1].price,
      `${english.tv}, ${english.radio}`,
      testData.expectedRoomValues[1].defaultDescription! // not translated since it is a user input
    );

    await roomsPage.editRoomDetails(
      testData.validRoomInputData[2].roomNumber,
      english.twinRoom,
      english.accessibilityTrue,
      testData.validRoomInputData[2].price,
      [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio],
      [roomsPage.roomDetails.views, roomsPage.roomDetails.safe],
      testData.expectedRoomValues[2].description! // not translated since it is a user input
    );

    await roomsPage.assertEditRoomPageDataIsCorrect(
      testData.expectedRoomValues[2].roomNumber,
      english.expectedRoomOutputData[2].type,
      english.expectedRoomOutputData[2].accessibility,
      testData.expectedRoomValues[2].price,
      `${english.safe}, ${english.views}`,
      testData.expectedRoomValues[2].description! // not translated since it is a user input
    );

    await page.goBack();

    await roomsPage.assertNewRoomIsCreatedWithCorrectData(
      testData.expectedRoomValues[2].roomNumber,
      english.expectedRoomOutputData[2].type,
      english.expectedRoomOutputData[2].accessibility,
      testData.expectedRoomValues[2].price,
      `${english.safe}, ${english.views}`
    );
  });

  // NOTE: Fails due to a bug in the application
  test("Test that you can delete rooms.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.createRoom(
      testData.validRoomInputData[3].roomNumber,
      english.suiteRoom,
      english.accessibilityFalse,
      testData.validRoomInputData[3].price,
      [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]
    );

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

    await roomsPage.createRoom(
      testData.validRoomInputData[0].roomNumber,
      english.singleRoom,
      english.accessibilityTrue,
      testData.validRoomInputData[0].price,
      [roomsPage.roomDetails.wifi, roomsPage.roomDetails.refreshments]
    );

    await roomsPage.createRoom(
      testData.validRoomInputData[1].roomNumber,
      english.familyRoom,
      english.accessibilityFalse,
      testData.validRoomInputData[1].price,
      [roomsPage.roomDetails.tv, roomsPage.roomDetails.radio]
    );

    await roomsPage.getAllAvailableRooms();
  });
});