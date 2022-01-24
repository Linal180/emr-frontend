// packages block
import { FC } from 'react';
// component block
import UpdatePatientForm from "./UpdatePatientForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { EDIT_PATIENT, PATIENTS_BREAD, PATIENT_EDIT_BREAD, USERS_BREAD } from '../../../../constants';

const AddPatientComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={EDIT_PATIENT}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_EDIT_BREAD]}
      />

      <UpdatePatientForm />
    </>
  )
};

export default AddPatientComponent;
