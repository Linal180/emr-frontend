// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import PatientForm from "../patientForm";
// constants, utils  block
import { ParamsType } from '../../../../interfacesTypes';

const AddPatientComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <PatientForm isEdit id={id} />
  )
};

export default AddPatientComponent;
