// packages block
import { FC } from 'react';
// component block
import AddDoctorForm from "./AddDoctorForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { CREATE_DOCTOR, DOCTORS_BREAD, DOCTOR_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddDoctorComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={CREATE_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD]}
      />

      <AddDoctorForm />
    </>
  )
};

export default AddDoctorComponent;
