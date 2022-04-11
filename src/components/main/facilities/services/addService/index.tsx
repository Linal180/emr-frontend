// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import ServiceForm from '../serviceForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY_SERVICE_NEW_BREAD,
  SERVICES
} from '../../../../../constants';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  const { facilityId } = useParams<ParamsType>();
  const servicesBreadcrumb = {
    text: SERVICES, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}`
  }

  return (
    <>
      <PageHeader
        title={ADD_SERVICE}
        path={[FACILITIES_BREAD, servicesBreadcrumb, FACILITY_SERVICE_NEW_BREAD]}
      />

      <ServiceForm />
    </>
  )
};

export default AddFacilityServiceComponent;
