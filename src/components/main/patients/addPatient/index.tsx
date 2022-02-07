// packages block
import { FC } from 'react';
// component block
import PatientForm from "../patientForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { PATIENTS_BREAD, ADD_PATIENT, PATIENT_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddPatientComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={ADD_PATIENT}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_NEW_BREAD]}
      />

      <PatientForm />
    </>
  )
};

export default AddPatientComponent;
