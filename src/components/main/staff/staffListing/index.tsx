// components block
import StaffTable from "./StaffTable";
import PageHeader from "../../../common/PageHeader";
// constants, utils and context block
import { useContext } from "react";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_STAFF, STAFF_BREAD, STAFF_ROUTE, STAFF_TEXT, DASHBOARD_BREAD, USER_PERMISSIONS
} from "../../../../constants";

const StaffComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext);
  const canAdd = checkPermission(userPermissions, USER_PERMISSIONS.createStaff)

  return (
    <>
      <PageHeader
        title={STAFF_TEXT}
        path={[DASHBOARD_BREAD, STAFF_BREAD]}
        hasComponent
        noAdd={!canAdd}
        buttonText={ADD_STAFF}
        linkToPage={`${STAFF_ROUTE}/new`}
      />

      <StaffTable />
    </>
  )
};

export default StaffComponent;
