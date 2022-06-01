// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import Chart from "./Chart";
import ChartingPageHeader from './ChartingPageHeader';
// constants block
import { ParamsType } from '../../../interfacesTypes';
import { PATIENTS_BREAD, USERS_BREAD, PATIENT_CHART, PATIENT_CHART_BREAD } from '../../../constants';

const PatientChartComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <ChartingPageHeader
        title={PATIENT_CHART}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_CHART_BREAD]}
        id={id}
      />

      <Chart />
    </>
  )
};

export default PatientChartComponent;
