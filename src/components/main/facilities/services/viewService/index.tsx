// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import ServiceForm from '../serviceForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  EDIT_SERVICE, FACILITIES_BREAD, FACILITY_EDIT_BREAD, FACILITY_SERVICES_BREAD,
} from '../../../../../constants';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={EDIT_SERVICE}
        path={[FACILITIES_BREAD, FACILITY_SERVICES_BREAD, FACILITY_EDIT_BREAD]}
      />

      <ServiceForm isEdit id={id} />
    </>
  )
};

export default AddFacilityServiceComponent;
