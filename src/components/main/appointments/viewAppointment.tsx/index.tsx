// packages block
import { FC } from 'react';
// component block
import AppointmentForm from "../appointmentForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import {
  VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD, APPOINTMENTS_BREAD, EDIT_APPOINTMENT
} from '../../../../constants';
import { useParams } from 'react-router';
import { ParamsType } from '../../../../interfacesTypes';

const VIewAppointmentComponent: FC = () => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={EDIT_APPOINTMENT}
        path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD, APPOINTMENT_NEW_BREAD]}
      />

      <AppointmentForm isEdit id={id} />
    </>
  )
};

export default VIewAppointmentComponent;
