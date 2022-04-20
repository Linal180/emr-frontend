// packages block
import { FC } from 'react';
// component block
import PracticeForm from "../practiceForm";
import PageHeader from '../../../common/PageHeader';
// constants, utils block
import { PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';

const AddPracticeComponent: FC = (): JSX.Element => <>
  <PageHeader title={PRACTICE_MANAGEMENT_TEXT} />

  <PracticeForm />
</>;

export default AddPracticeComponent;
