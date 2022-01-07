import { ADD_STAFF, STAFF_TEXT } from "../../../../constants";
import MainLayout from "../../../common/MainLayout";

const AddStaffComponent = () => {
  const breadcrumb = {
    title: ADD_STAFF,
    path: [STAFF_TEXT, ADD_STAFF],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>

    </MainLayout>
  )
};

export default AddStaffComponent;
