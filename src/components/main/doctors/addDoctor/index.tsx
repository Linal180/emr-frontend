// packages block
import { FC } from 'react';
// component block
import DoctorForm from "../doctorForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_DOCTOR, DOCTORS_BREAD, DOCTOR_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddDoctorComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={ADD_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD]}
      />

      <DoctorForm />
    </>
  )
};

export default AddDoctorComponent;
