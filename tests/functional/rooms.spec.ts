import test, { expect } from "playwright/test";
import { Room, RoomsPage } from "../pageObjects/roomsPage";
import { roomsTestData } from "../../fixtures/testData.json";
import { Hooks } from "../../utils/hooks";
import { APP_LABEL } from "../../utils/environmentVariables";

test.describe("Rooms test cases", async () => {
  test.beforeEach(async ({ page }) => {
    await new Hooks(page).beforeEachPreconditions();
  });

  test.afterEach(async ({ page }) => {
    await new Hooks(page).afterEachPostconditions();

    // TODO: Add cleanup functionality to delete all rooms since not having personal account and data is often changing. Currently the delete functionality doesn't work though.
    });

  test("Test that you can create a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const room = roomsTestData.validExample1;

    await roomsPage.createRooms([{
      roomNumber: room.input.roomNumber,
      type: APP_LABEL.singleRoom,
      accessibility: APP_LABEL.accessibilityTrue,
      price: room.input.price,
      roomDetails: ["WiFi", "Refreshments"]
    }]);

    await roomsPage.assertLastRoomsDataIsCorrect(
      room.output.roomNumber,
      APP_LABEL.expectedRoomOutputData[0].type,
      APP_LABEL.expectedRoomOutputData[0].accessibility,
      room.output.price,
      `${APP_LABEL.wifi}, ${APP_LABEL.refreshments}`
    );
  });

  test("Test that you can not create a room with invalid input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const room = roomsTestData.validExample1;
    const invalidRoom = roomsTestData.invalidExample1;

    await roomsPage.fillInRoomNumber(room.input.roomNumber);
    await roomsPage.fillInPrice(invalidRoom.input.price);
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText(APP_LABEL.invalidPriceErrorMessage);
  });

  test("Test that you can not create a room with empty input data.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    // Simply click the Create button, because by default inputs are empty
    await roomsPage.clickTheCreateButton();

    await expect(roomsPage.dangerAlert).toContainText(APP_LABEL.emptyRoomNumberErrorMessage);
    await expect(roomsPage.dangerAlert).toContainText(APP_LABEL.emptyPriceErrorMessage);
  });

  test("Test that you can update a room.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const newRoom = roomsTestData.validExample2;
    const updatedRoom = roomsTestData.validExample3;

    await roomsPage.createRooms([{
      roomNumber: newRoom.input.roomNumber,
      type: APP_LABEL.familyRoom,
      accessibility: APP_LABEL.accessibilityFalse,
      price: newRoom.input.price,
      roomDetails: ["TV", "Radio"]
    }]);

    await roomsPage.clickOnLastAddedRoomRow();

    await roomsPage.assertEditRoomPageDataIsCorrect({
      roomNumber: newRoom.output.roomNumber.toString(),
      type: APP_LABEL.expectedRoomOutputData[1].type,
      accessibility: APP_LABEL.expectedRoomOutputData[1].accessibility,
      price: Number(newRoom.output.price),
      roomDetails: ["TV", "Radio"],
      description: newRoom.output.defaultDescription // not translated since it is a user input
    });

    await roomsPage.editRoomDetails({
      roomNumber: updatedRoom.input.roomNumber,
      type: APP_LABEL.twinRoom,
      accessibility: APP_LABEL.accessibilityTrue,
      price: updatedRoom.input.price,
      roomDetails: ["Views", "Safe"],
      description: updatedRoom.input.description // not translated since it is a user input
      },
      ["TV", "Radio"]
    );

    await roomsPage.assertEditRoomPageDataIsCorrect({
      roomNumber: updatedRoom.output.roomNumber,
      type: APP_LABEL.expectedRoomOutputData[2].type,
      accessibility: APP_LABEL.expectedRoomOutputData[2].accessibility,
      price: updatedRoom.output.price,
      roomDetails: ["Safe", "Views"],
      description: updatedRoom.output.description // not translated since it is a user input
    });

    await page.goBack();

    await roomsPage.assertLastRoomsDataIsCorrect(
      updatedRoom.output.roomNumber,
      APP_LABEL.expectedRoomOutputData[2].type,
      APP_LABEL.expectedRoomOutputData[2].accessibility,
      updatedRoom.output.price,
      `${APP_LABEL.safe}, ${APP_LABEL.views}`
    );
  });

  // NOTE: Fails due to a bug in the application: https://github.com/mwinteringham/restful-booker-platform/issues/238
  test("Test that you can delete rooms.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const room = roomsTestData.validExample4;

    await roomsPage.createRooms([{
      roomNumber: room.input.roomNumber,
      type: APP_LABEL.suiteRoom,
      accessibility: APP_LABEL.accessibilityFalse,
      price: room.input.price,
      roomDetails: ["WiFi", "Refreshments"]
    }]);

    const initialNumberOfRooms = await roomsPage.getNumberOfRooms();
    const roomDataAfterAddingTheRoom = await roomsPage.getLastRoomData();

    await roomsPage.deleteLastAddedRoom();

    const numberOfRoomsAfterDeletion = await roomsPage.getNumberOfRooms();
    const roomDataAfterDeletingTheRoom = await roomsPage.getLastRoomData();

    expect(numberOfRoomsAfterDeletion).toEqual(initialNumberOfRooms - 1);
    expect(roomDataAfterDeletingTheRoom).not.toEqual(roomDataAfterAddingTheRoom);
  });

  // NOTE: Fails due to a bug in the application: https://github.com/mwinteringham/restful-booker-platform/issues/251
  test("Test that you can view the available rooms in the system.", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const zeroRoomInput = {
      roomNumber: roomsTestData.validExample0.input.roomNumber,
      type: APP_LABEL.singleRoom,
      accessibility: APP_LABEL.accessibilityTrue,
      price: roomsTestData.validExample0.input.price,
      roomDetails: ["TV", "WiFi", "Safe"]
    } as Room;
    const firstRoomInput = {
      roomNumber: roomsTestData.validExample5.input.roomNumber,
      type: APP_LABEL.singleRoom,
      accessibility: APP_LABEL.accessibilityTrue,
      price: roomsTestData.validExample5.input.price,
      roomDetails: ["WiFi", "Refreshments"]
    } as Room;
    const secondRoomInput = {
      roomNumber: roomsTestData.validExample6.input.roomNumber,
      type: APP_LABEL.familyRoom,
      accessibility: APP_LABEL.accessibilityFalse,
      price: roomsTestData.validExample6.input.price,
      roomDetails: ["TV", "Radio"]
    } as Room;
    const thirdRoomInput = {
      roomNumber: roomsTestData.validExample7.input.roomNumber,
      type: APP_LABEL.familyRoom,
      accessibility: APP_LABEL.accessibilityTrue,
      price: roomsTestData.validExample7.input.price,
      roomDetails: ["Radio", "Views"]
    } as Room;

    await roomsPage.createRooms([firstRoomInput, secondRoomInput, thirdRoomInput]);

    const rooms = await roomsPage.getAllAvailableRooms();
    const zeroRoomResult = rooms[0];
    const firstRoomResult = rooms[1];
    const secondRoomResult = rooms[2];
    const thirdRoomResult = rooms[3];

    expect(zeroRoomResult).toEqual(zeroRoomInput);
    expect(firstRoomResult).toEqual(firstRoomInput);
    expect(secondRoomResult).toEqual(secondRoomInput);
    expect(thirdRoomResult).toEqual(thirdRoomInput);
  });
});