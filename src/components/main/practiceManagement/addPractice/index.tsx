// packages block
import { FC } from 'react';
// component block
import AddPracticeForm from "./addPracticeForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';

const AddPracticeComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
      />

      <AddPracticeForm />
    </>
  )
};

export default AddPracticeComponent;
