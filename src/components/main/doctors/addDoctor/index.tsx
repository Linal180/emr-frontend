// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import DoctorForm from "../doctorForm";
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
// constants, utils block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_DOCTOR, DOCTORS_BREAD, DOCTOR_NEW_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USERS_BREAD, USER_PERMISSIONS
} from '../../../../constants';

const AddDoctorComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createDoctor)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ADD_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD]}
      />

      <DoctorForm />
    </>
  )
};

export default AddDoctorComponent;
