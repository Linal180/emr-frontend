// packages block
import { FC } from 'react';
// component block
import ViewPracticeForm from "./viewPracticeForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';

const ViewPracticeComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
      />

      <ViewPracticeForm />
    </>
  )
};

export default ViewPracticeComponent;
