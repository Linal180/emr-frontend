// packages block
import { FC } from 'react';
// component block
import UpdateDoctorForm from "./UpdateDoctorForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { EDIT_DOCTOR, DOCTORS_BREAD, DOCTOR_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddDoctorComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={EDIT_DOCTOR}
        path={[USERS_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD]}
      />

      <UpdateDoctorForm />
    </>
  )
};

export default AddDoctorComponent;
