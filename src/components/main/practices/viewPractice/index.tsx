// packages block
import { FC } from 'react';
// component block
import PracticeForm from "../practiceForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { PRACTICE_MANAGEMENT_TEXT } from '../../../../constants';
import { useParams } from 'react-router';
import { ParamsType } from '../../../../interfacesTypes';

const ViewPracticeComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={PRACTICE_MANAGEMENT_TEXT}
      />

      <PracticeForm isEdit id={id} />
    </>
  )
};

export default ViewPracticeComponent;
