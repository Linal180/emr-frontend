// packages block
import { useContext, useEffect } from 'react';
// component block
import RolesTable from './RolesTable';
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
// constants, history, styling block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_NEW_TEXT, ADD_ROLES_ROUTE, PERMISSION_DENIED, ROLES_TEXT, ROOT_ROUTE, USER_PERMISSIONS,
} from '../../../../constants';

const RolesComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.getAllRoles)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ROLES_TEXT}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        linkToPage={ADD_ROLES_ROUTE}
      />

      <RolesTable />
    </>
  )
}

export default RolesComponent;
