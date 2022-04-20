// packages block
import { FC } from 'react';
// component block
import AppointmentForm from "../appointmentForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import {
  ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD, APPOINTMENTS_BREAD,
} from '../../../../constants';

const AddAppointmentComponent: FC = () => <>
  <PageHeader
    title={ADD_APPOINTMENT}
    path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD]}
  />

  <AppointmentForm />
</>;

export default AddAppointmentComponent;
