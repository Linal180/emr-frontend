// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// components block
import ServicesTable from './ServiceTable';
import PageHeader from '../../../../common/PageHeader';
// constants block / generated
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_ROUTE, FACILITY_SERVICES_BREAD, FACILITY_SERVICES_ROUTE,
  FACILITY_SERVICES_TEXT
} from "../../../../../constants";

const FacilityServicesComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        hasComponent
        buttonText={ADD_SERVICE}
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITY_SERVICES_BREAD]}
        linkToPage={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}/new`}
      />

      <ServicesTable />
    </>
  )
}

export default FacilityServicesComponent;
