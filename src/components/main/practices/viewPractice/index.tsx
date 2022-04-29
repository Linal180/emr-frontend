// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import PracticeForm from "../practiceForm";
// constants block
import { ParamsType } from '../../../../interfacesTypes';

const ViewPracticeComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <PracticeForm isEdit id={id} />
  )
};

export default ViewPracticeComponent;
