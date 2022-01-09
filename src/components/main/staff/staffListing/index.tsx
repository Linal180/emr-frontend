// components block
import MainLayout from "../../../common/MainLayout";
// constants block
import StaffTable from "./StaffTable";
import { ADD_STAFF, ALL_STAFF, STAFF_LISTING, STAFF_ROUTE } from "../../../../constants";

const StaffComponent = (): JSX.Element => {
  const breadcrumb = {
    hasButton: true,
    title: ALL_STAFF,
    buttonText: ADD_STAFF,
    link: `${STAFF_ROUTE}/new`,
    path: [ALL_STAFF, STAFF_LISTING],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <StaffTable />
    </MainLayout>
  )
};

export default StaffComponent;
