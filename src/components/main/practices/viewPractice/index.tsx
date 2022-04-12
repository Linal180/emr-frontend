// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import PracticeForm from "../practiceForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../interfacesTypes';
import { PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';

const ViewPracticeComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader title={PRACTICE_MANAGEMENT_TEXT} />

      <PracticeForm isEdit id={id} />
    </>
  )
};

export default ViewPracticeComponent;
