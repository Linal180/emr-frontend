// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import AppointmentForm from "../appointmentForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../interfacesTypes';
import {
  VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_BREAD, EDIT_APPOINTMENT, APPOINTMENT_EDIT_BREAD,
} from '../../../../constants';

const VIewAppointmentComponent: FC = () => {
  const { id } = useParams<ParamsType>();

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
