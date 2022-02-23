// packages block
import { FC } from 'react';
// component block
import PracticeTable from './PracticeTable';
import PracticePageHeader from '../../../common/PracticePageHeader';
// constants block
import { ADD_NEW_PRACTICE_TEXT, PRACTICE_MANAGEMENT_ROUTE, PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';

const PracticeListingComponent: FC = (): JSX.Element => {
  return (
    <>
      <PracticePageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
        hasComponent
        linkToPage={`${PRACTICE_MANAGEMENT_ROUTE}/new`}
        buttonText={ADD_NEW_PRACTICE_TEXT}
      />

      <PracticeTable />
    </>
  )
};

export default PracticeListingComponent;
