// component block
import UpdateStaffForm from "./UpdateStaffForm";
// constant block
import { STAFF_BREAD, STAFF_EDIT_BREAD, USERS_BREAD, VIEW_STAFF } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";

const ViewStaffComponent = () => {
  return (
    <>
      <PageHeader
        title={VIEW_STAFF}
        path={[USERS_BREAD, STAFF_BREAD, STAFF_EDIT_BREAD]}
      />

      <UpdateStaffForm />
    </>
  )
};

export default ViewStaffComponent;
