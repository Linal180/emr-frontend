// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import StaffForm from "../staffForm";
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_STAFF, PERMISSION_DENIED, ROOT_ROUTE, STAFF_BREAD, STAFF_NEW_BREAD, USERS_BREAD, USER_PERMISSIONS
} from '../../../../constants';

const AddStaffComponent: FC = () => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createStaff)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ADD_STAFF}
        path={[USERS_BREAD, STAFF_BREAD, STAFF_NEW_BREAD]}
      />

      <StaffForm />
    </>
  )
};

export default AddStaffComponent;
