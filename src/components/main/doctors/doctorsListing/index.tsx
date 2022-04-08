// packages block
import { FC, useContext, useEffect } from "react";
// components block
import Alert from "../../../common/Alert";
import DoctorsTable from "./DoctorsTable";
import PageHeader from "../../../common/PageHeader";
// constants, utils and context block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import {
  ADD_DOCTOR, DOCTORS_BREAD, DOCTORS_ROUTE, DOCTORS_TEXT, PERMISSION_DENIED, ROOT_ROUTE, USERS_BREAD, 
  USER_PERMISSIONS
} from "../../../../constants";

const DoctorsComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createPractice)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        hasComponent
        title={DOCTORS_TEXT}
        buttonText={ADD_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD]}
        linkToPage={`${DOCTORS_ROUTE}/new`}
      />

      <DoctorsTable />
    </>
  )
}

export default DoctorsComponent;
