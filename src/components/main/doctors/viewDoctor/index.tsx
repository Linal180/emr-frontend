// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// component block
import DoctorForm from "../doctorForm";
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
// constants, utils and interfaces block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { ParamsType } from '../../../../interfacesTypes';
import {
  EDIT_DOCTOR, DOCTORS_BREAD, DOCTOR_EDIT_BREAD, USERS_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USER_PERMISSIONS
} from '../../../../constants';

const AddDoctorComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updateDoctor)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);
  return (
    <>
      <PageHeader
        title={EDIT_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_EDIT_BREAD]}
      />

      <DoctorForm id={id} isEdit />
    </>
  )
};

export default AddDoctorComponent;
