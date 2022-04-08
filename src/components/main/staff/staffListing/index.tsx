// packages block
import { useContext, useEffect } from "react";
// components block
import StaffTable from "./StaffTable";
import Alert from "../../../common/Alert";
import PageHeader from "../../../common/PageHeader";
// constants, utils and context block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_STAFF, PERMISSION_DENIED, ROOT_ROUTE, STAFF_BREAD, STAFF_ROUTE, STAFF_TEXT, USERS_BREAD, USER_PERMISSIONS
} from "../../../../constants";

const StaffComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllStaff)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={STAFF_TEXT}
        path={[USERS_BREAD, STAFF_BREAD]}
        hasComponent
        buttonText={ADD_STAFF}
        linkToPage={`${STAFF_ROUTE}/new`}
      />

      <StaffTable />
    </>
  )
}

export default StaffComponent;
