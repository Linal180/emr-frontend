// packages block
import { FC } from "react";
// components block
import RoleForm from "../form";
import PageHeader from "../../../common/PageHeader";
// constants block
import { ADD_ROLE_TEXT, SAVE_TEXT } from "../../../../constants";

const AddRole: FC = () => {

  return (
    <>
    <PageHeader
      title={ADD_ROLE_TEXT}
      buttonText={SAVE_TEXT}
      />

      <RoleForm />
      </>

  )
}

export default AddRole;
