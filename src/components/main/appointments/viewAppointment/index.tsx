// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import AppointmentForm from "../appointmentForm";
// constants block
import { ParamsType } from '../../../../interfacesTypes';

const VIewAppointmentComponent: FC = () => {
  const { id } = useParams<ParamsType>();

  return (
    <AppointmentForm isEdit id={id} />
  )
};

export default VIewAppointmentComponent;
