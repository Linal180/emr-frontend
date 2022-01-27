// components block
import { TimeZoneComponent } from "./timeZone";
import PageHeader from "../../common/PageHeader";
// constants block
import { SETTINGS_TEXT } from "../../../constants";

export const SettingsComponent = () => (
  <>
    <PageHeader title={SETTINGS_TEXT} />
    <TimeZoneComponent />
  </>
);
