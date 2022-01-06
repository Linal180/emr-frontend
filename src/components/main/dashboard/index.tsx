// components block
import MainLayout from "../../common/MainLayout";
import PageHeader from "../../common/PageHeader";
// constants block
import { DASHBOARD_TEXT } from "../../../constants";

const DashboardComponent = (): JSX.Element => (
  <MainLayout>
    <PageHeader
      title={DASHBOARD_TEXT}
      hasComponent
    />
  </MainLayout>
);

export default DashboardComponent;
