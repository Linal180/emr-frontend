// packages block
import { FC, useContext, useEffect } from "react";
// components block
import Alert from "../../../common/Alert";
import PageHeader from "../../../common/PageHeader";
import AppointmentsTable from "../../../common/AppointmentsTable";
// constants and utils block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_ROUTE, APPOINTMENT_TEXT, APPOINTMENTS_BREAD, 
  PERMISSION_DENIED, ROOT_ROUTE, USER_PERMISSIONS
} from "../../../../constants";

const AppointmentsComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllAppointments)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={APPOINTMENT_TEXT}
        path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD]}
        hasComponent
        buttonText={ADD_APPOINTMENT}
        linkToPage={`${APPOINTMENTS_ROUTE}/new`}
      />

      <AppointmentsTable />
    </>
  )
}

export default AppointmentsComponent;
