// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// components block
import ServicesTable from './ServiceTable';
import PageHeader from '../../../../common/PageHeader';
// constants block / generated
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY_SERVICES_TEXT, SERVICES
} from "../../../../../constants";

const FacilityServicesComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const servicesBreadcrumb = { text: SERVICES, link: '' }

  return (
    <>
      <PageHeader
        hasComponent
        buttonText={ADD_SERVICE}
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITIES_BREAD, servicesBreadcrumb]}
        linkToPage={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}/new`}
      />

      <ServicesTable />
    </>
  )
}

export default FacilityServicesComponent;
