// packages block
import { FC, useContext } from "react";
// components block
import DoctorsTable from "./DoctorsTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import {
  ADD_DOCTOR, DOCTORS_BREAD, DOCTORS_ROUTE, DOCTORS_TEXT, DASHBOARD_BREAD, USER_PERMISSIONS,
} from "../../../../constants";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";

const DoctorsComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext);
  const canAdd = checkPermission(userPermissions, USER_PERMISSIONS.createDoctor)

  return (<>
    <PageHeader
      hasComponent
      title={DOCTORS_TEXT}
      buttonText={ADD_DOCTOR}
      path={[DASHBOARD_BREAD, DOCTORS_BREAD]}
      linkToPage={`${DOCTORS_ROUTE}/new`}
      noAdd={!canAdd}
    />

    <DoctorsTable />
  </>);
}

export default DoctorsComponent;
