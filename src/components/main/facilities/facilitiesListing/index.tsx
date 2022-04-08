// packages block
import { FC, useContext, useEffect } from 'react';
// components block
import Alert from '../../../common/Alert';
import FacilityTable from "./FacilityTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_FACILITY, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITIES_TEXT, PERMISSION_DENIED, ROOT_ROUTE,
  USER_PERMISSIONS
} from "../../../../constants";

const FacilityComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllFacility)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={FACILITIES_TEXT}
        path={[FACILITIES_BREAD]}
        hasComponent
        buttonText={ADD_FACILITY}
        linkToPage={`${FACILITIES_ROUTE}/new`}
      />

      <FacilityTable />
    </>
  )
}

export default FacilityComponent;
