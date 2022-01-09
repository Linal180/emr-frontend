// packages block
import { FC } from 'react';
// component block
import AddStaffForm from "./AddStaffForm";
import MainLayout from "../../../common/MainLayout";
// constant block
import { ADD_STAFF, STAFF_TEXT, USERS_TEXT } from "../../../../constants";

const AddStaffComponent: FC = () => {
  const breadcrumb = {
    title: ADD_STAFF,
    path: [USERS_TEXT, STAFF_TEXT, ADD_STAFF],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <AddStaffForm />
    </MainLayout>
  )
};

export default AddStaffComponent;
