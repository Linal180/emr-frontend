// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import VitalsChartingTable from './vitalChartComponent';
import ChartingPageHeader from '../../ChartingPageHeader';
// constants block
import { ParamsType } from '../../../../../../interfacesTypes';
import { EDIT_PATIENT, PATIENTS_BREAD, PATIENT_EDIT_BREAD, USERS_BREAD } from '../../../../../../constants';

const VitalChartComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <ChartingPageHeader
        title={EDIT_PATIENT}
        path={[USERS_BREAD, PATIENTS_BREAD, PATIENT_EDIT_BREAD]}
        id={id}
      />

      <VitalsChartingTable isCalendar={true} />
    </>
  )
};

export default VitalChartComponent;
