// packages block
import { FC } from 'react';
// component block
import ServiceForm from '../serviceForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITY_SERVICES_BREAD, FACILITY_SERVICE_NEW_BREAD
} from '../../../../../constants';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={ADD_SERVICE}
        path={[FACILITIES_BREAD, FACILITY_SERVICES_BREAD, FACILITY_SERVICE_NEW_BREAD]}
      />

      <ServiceForm />
    </>
  )
};

export default AddFacilityServiceComponent;
