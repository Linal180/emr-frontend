// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// component block
import PatientForm from "../patientForm";
import PageHeader from '../../../common/PageHeader';
import Alert from '../../../common/Alert';
// constants, utils  block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { ParamsType } from '../../../../interfacesTypes';
import {
  EDIT_PATIENT, PATIENTS_BREAD, PATIENT_EDIT_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USERS_BREAD, USER_PERMISSIONS
} from '../../../../constants';

const AddPatientComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updatePatient)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={EDIT_PATIENT}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_EDIT_BREAD]}
      />

      <PatientForm isEdit id={id} />
    </>
  )
};

export default AddPatientComponent;
