// packages block
import { FC } from 'react';
// component block
import AddDoctorForm from "./AddDoctorForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_DOCTOR, DOCTORS_BREAD, DOCTOR_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddDoctorComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={ADD_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD]}
      />

      <AddDoctorForm />
    </>
  )
};

export default AddDoctorComponent;
