// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import ServiceForm from '../serviceForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  EDIT_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_EDIT_BREAD, FACILITY_SERVICES_ROUTE, SERVICES,
} from '../../../../../constants';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  const { id, facilityId } = useParams<ParamsType>();
  const servicesBreadcrumb = { text: SERVICES, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}` }

  return (
    <>
      <PageHeader
        title={EDIT_SERVICE}
        path={[FACILITIES_BREAD, servicesBreadcrumb, FACILITY_EDIT_BREAD]}
      />

      <ServiceForm isEdit id={id} />
    </>
  )
};

export default AddFacilityServiceComponent;
