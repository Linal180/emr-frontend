// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import Alert from '../../../common/Alert';
import FacilityForm from "../facilityForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { ADD_FACILITY, FACILITIES_BREAD, FACILITY_NEW_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USER_PERMISSIONS } from '../../../../constants';

const AddFacilityComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if(!checkPermission(userPermissions, USER_PERMISSIONS.createFacility)){
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ADD_FACILITY}
        path={[FACILITIES_BREAD, FACILITY_NEW_BREAD]}
      />

      <FacilityForm />
    </>
  )
};

export default AddFacilityComponent;
