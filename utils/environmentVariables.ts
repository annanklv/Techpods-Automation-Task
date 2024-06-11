import { AppLabel, getAppLabelsByLocale } from "./appLabelTranslating";

export const USERNAME: string = String(process.env.ADMIN_USERNAME);
export const PASSWORD: string = String(process.env.ADMIN_PASSWORD);
export const APP_LABEL: AppLabel = getAppLabelsByLocale(String(process.env.APP_LANGUAGE));
