// component block
import MainLayout from "../../../common/MainLayout";
// constant block
import { VIEW_STAFF, STAFF_TEXT } from "../../../../constants";

const ViewStaffComponent = () => {
  const breadcrumb = {
    title: VIEW_STAFF,
    path: [STAFF_TEXT, VIEW_STAFF],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>

    </MainLayout>
  )
};

export default ViewStaffComponent;
