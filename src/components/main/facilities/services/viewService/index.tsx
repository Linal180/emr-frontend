// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import ServiceForm from '../serviceForm';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return <ServiceForm isEdit id={id} />
};

export default AddFacilityServiceComponent;
