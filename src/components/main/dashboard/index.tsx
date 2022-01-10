// components block
import PageHeader from "../../common/PageHeader";
// constants block
import { DASHBOARD_TEXT } from "../../../constants";

const DashboardComponent = (): JSX.Element => (
  <PageHeader
    title={DASHBOARD_TEXT}
  />
);

export default DashboardComponent;
