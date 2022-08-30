// packages block
import { useContext } from "react";
// components block
import PatientsTable from "./PatientsTable";
import PageHeader from "../../../common/PageHeader";
// constants, contexts block
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_PATIENT, PATIENTS_BREAD, PATIENTS_ROUTE, PATIENTS_TEXT, DASHBOARD_BREAD, USER_PERMISSIONS,
} from "../../../../constants";

const LabResultsComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext);
  const canAdd = checkPermission(userPermissions, USER_PERMISSIONS.createPatient)

  return (<>
    <PageHeader
      title={PATIENTS_TEXT}
      path={[DASHBOARD_BREAD, PATIENTS_BREAD]}
      hasComponent
      buttonText={ADD_PATIENT}
      linkToPage={`${PATIENTS_ROUTE}/new`}
      noAdd={!canAdd}
    />

    <PatientsTable />
  </>);
}

export default LabResultsComponent;
