// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import Alert from '../../../common/Alert';
import AppointmentForm from "../appointmentForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD, APPOINTMENTS_BREAD, PERMISSION_DENIED,
  ROOT_ROUTE, USER_PERMISSIONS
} from '../../../../constants';

const AddAppointmentComponent: FC = () => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createAppointment)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ADD_APPOINTMENT}
        path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD]}
      />

      <AppointmentForm />
    </>
  )
};

export default AddAppointmentComponent;
