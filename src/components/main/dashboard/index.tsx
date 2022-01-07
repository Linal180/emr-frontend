// components block
import MainLayout from "../../common/MainLayout";
// constants block
import { DASHBOARD_TEXT } from "../../../constants";

const DashboardComponent = (): JSX.Element => {
  const breadcrumb = {
    hasButton: false,
    title: DASHBOARD_TEXT,
    path: [DASHBOARD_TEXT],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
    </MainLayout>
  )
};

export default DashboardComponent;
