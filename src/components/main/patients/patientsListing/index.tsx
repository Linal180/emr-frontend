// packages block
import { useContext, useEffect } from "react";
// components block
import Alert from "../../../common/Alert";
import PatientsTable from "./PatientsTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_PATIENT, PATIENTS_BREAD, PATIENTS_ROUTE, PATIENTS_TEXT, PERMISSION_DENIED, ROOT_ROUTE, USERS_BREAD,
  USER_PERMISSIONS
} from "../../../../constants";

const LabResultsComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllPatient)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={PATIENTS_TEXT}
        path={[USERS_BREAD, PATIENTS_BREAD]}
        hasComponent
        buttonText={ADD_PATIENT}
        linkToPage={`${PATIENTS_ROUTE}/new`}
      />

      <PatientsTable />
    </>
  )
}

export default LabResultsComponent;
