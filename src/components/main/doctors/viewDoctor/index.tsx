// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import DoctorForm from "../doctorForm";
import PageHeader from '../../../common/PageHeader';
// constants, utils and interfaces block
import { ParamsType } from '../../../../interfacesTypes';
import { EDIT_DOCTOR, DOCTORS_BREAD, DOCTOR_EDIT_BREAD, USERS_BREAD } from '../../../../constants';

const AddDoctorComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

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
