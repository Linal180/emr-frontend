// packages block
import { FC } from 'react';
// component block
import AddPracticeForm from "./addPracticeForm";
import PracticePageHeader from '../../../common/PracticePageHeader';
// constants block
import { PRACTICE_MANAGEMENT_TEXT, SAVE_TEXT } from '../../../../constants';

const AddPracticeComponent: FC = (): JSX.Element => {
  return (
    <>
      <PracticePageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
        hasComponent
        buttonText={SAVE_TEXT}
      />

      <AddPracticeForm />
    </>
  )
};

export default AddPracticeComponent;
