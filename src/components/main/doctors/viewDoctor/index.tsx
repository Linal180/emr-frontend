// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import DoctorForm from "../doctorForm";
// constants, utils and interfaces block
import { ParamsType } from '../../../../interfacesTypes';

const AddDoctorComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return <DoctorForm id={id} isEdit />
};

export default AddDoctorComponent;
