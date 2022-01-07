// components block
import MainLayout from "../../../common/MainLayout";
// constants block
import StaffTable from "./StaffTable";
import { ADD_STAFF, ALL_STAFF, FACILITIES_ROUTE, STAFF_LISTING } from "../../../../constants";

const UsersComponent = (): JSX.Element => {
  const breadcrumb = {
    hasButton: true,
    title: ALL_STAFF,
    buttonText: ADD_STAFF,
    link: `${FACILITIES_ROUTE}/new`,
    path: [ALL_STAFF, STAFF_LISTING],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <StaffTable />
    </MainLayout>
  )
};

export default UsersComponent;
