// packages block
import { FC } from 'react';
// component block
import AllergiesCardComponent from './AllergiesCardComponent';
// constants block
import { ALLERGIES_TEXT, PATIENT_CHARTING_DATA } from '../../../../../../constants';

const AllergiesComponent: FC = (): JSX.Element => {
  return (
    <>
      <AllergiesCardComponent cardTitle={ALLERGIES_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />
    </>
  )
};

export default AllergiesComponent;
