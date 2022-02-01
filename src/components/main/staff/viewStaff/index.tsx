// 
import { useParams } from "react-router";
// component block
import StaffForm from "../staffForm";
import PageHeader from "../../../common/PageHeader";
// constant block
import { ParamsType } from "../../../../interfacesTypes";
import { STAFF_BREAD, STAFF_EDIT_BREAD, USERS_BREAD, VIEW_STAFF } from "../../../../constants";

const ViewStaffComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  
  return (
    <>
      <PageHeader
        title={VIEW_STAFF}
        path={[USERS_BREAD, STAFF_BREAD, STAFF_EDIT_BREAD]}
      />

      <StaffForm id={id} isEdit />
    </>
  )
};

export default ViewStaffComponent;
