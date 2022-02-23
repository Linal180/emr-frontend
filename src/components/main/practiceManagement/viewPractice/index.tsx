// packages block
import { FC } from 'react';
// component block
import ViewPracticeForm from "./viewPracticeForm";
import PracticePageHeader from '../../../common/PracticePageHeader';
// constants block
import { PRACTICE_MANAGEMENT_TEXT, SAVE_TEXT } from '../../../../constants';

const ViewPracticeComponent: FC = (): JSX.Element => {
  return (
    <>
      <PracticePageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
        hasComponent
        buttonText={SAVE_TEXT}
      />

      <ViewPracticeForm />
    </>
  )
};

export default ViewPracticeComponent;
