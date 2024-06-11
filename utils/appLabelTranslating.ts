import appLabelsByLocale from "../fixtures/appLabelsByLocale.json";

export const getAppLabelsByLocale = (appLanguage: string) => {
  let appLabel = {} as AppLabel;
  switch (appLanguage.toLowerCase()) {
    case "english":
      appLabel = appLabelsByLocale["en-EN"];
      break;
    case "bulgarian":
      appLabel = appLabelsByLocale["bg-BG"];
      break;
    case "german":
      appLabel = appLabelsByLocale["de-DE"];
      break;
    default:
      throw new Error("Application language is not supported.")
  }

  return appLabel;
}

export interface AppLabel {
  wifi: string;
  refreshments: string;
  tv: string;
  safe: string;
  radio: string;
  views: string;
  singleRoom: string;
  twinRoom: string;
  doubleRoom: string;
  familyRoom: string;
  suiteRoom: string;
  accessibilityTrue: string;
  accessibilityFalse: string;
  roomLabel: string;
  typeLabel: string;
  accessibleLabel: string;
  featuresLabel: string;
  roomPriceLabel: string;
  descriptionLabel: string;
  roomsNavButton: string;
  reportNavButton: string;
  brandingNavButton: string;
  navHeader: string;
  frontPageNavButton: string;
  logoutNavButton: string;
  loginHeader: string;
  emptyRoomNumberErrorMessage: string;
  emptyPriceErrorMessage: string;
  invalidPriceErrorMessage: string;
  noAvailableRoomsErrorMessage: string;
  expectedRoomOutputData: Array<{ type: string; accessibility: string; }>
}