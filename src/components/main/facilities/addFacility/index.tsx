// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import Alert from '../../../common/Alert';
import FacilityForm from '../facilityForm';
// context, utils and constants
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { USER_PERMISSIONS, PERMISSION_DENIED, ROOT_ROUTE } from '../../../../constants';

const AddFacilityComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if(!checkPermission(userPermissions, USER_PERMISSIONS.createFacility)){
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);
  
  return <FacilityForm />
}


export default AddFacilityComponent;
