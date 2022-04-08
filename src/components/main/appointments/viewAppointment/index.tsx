// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// component block
import Alert from '../../../common/Alert';
import AppointmentForm from "../appointmentForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { ParamsType } from '../../../../interfacesTypes';
import {
  VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_BREAD, EDIT_APPOINTMENT, APPOINTMENT_EDIT_BREAD, PERMISSION_DENIED,
   ROOT_ROUTE, USER_PERMISSIONS
} from '../../../../constants';

const VIewAppointmentComponent: FC = () => {
  const { id } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updateAppointment)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={EDIT_APPOINTMENT}
        path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_EDIT_BREAD]}
      />

      <AppointmentForm isEdit id={id} />
    </>
  )
};

export default VIewAppointmentComponent;
