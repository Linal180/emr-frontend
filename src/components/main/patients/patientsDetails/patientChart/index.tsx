// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import PatientChart from "./patientChart";
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import { EDIT_PATIENT, PATIENTS_BREAD, PATIENT_EDIT_BREAD, USERS_BREAD } from '../../../../../constants';

const PatientChartComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={EDIT_PATIENT}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_EDIT_BREAD]}
        isIcon
        id={id}
      />

      <PatientChart />
    </>
  )
};

export default PatientChartComponent;
