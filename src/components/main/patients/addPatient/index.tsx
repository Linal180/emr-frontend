// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import PatientForm from "../patientForm";
import Alert from '../../../common/Alert';
import PageHeader from '../../../common/PageHeader';
// constants, utils block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  PATIENTS_BREAD, ADD_PATIENT, PATIENT_NEW_BREAD, USERS_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USER_PERMISSIONS
} from '../../../../constants';

const AddPatientComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createPatient)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

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
