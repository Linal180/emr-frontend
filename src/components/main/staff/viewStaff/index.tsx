//  packages block
import { useParams } from "react-router";
// component block
import StaffForm from "../staffForm";
import Alert from "../../../common/Alert";
import PageHeader from "../../../common/PageHeader";
// constant block
import history from "../../../../history";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import { ParamsType } from "../../../../interfacesTypes";
import {
  PERMISSION_DENIED, ROOT_ROUTE, STAFF_BREAD, STAFF_EDIT_BREAD, USERS_BREAD, USER_PERMISSIONS, VIEW_STAFF
} from "../../../../constants";

const ViewStaffComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updateStaff)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

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
