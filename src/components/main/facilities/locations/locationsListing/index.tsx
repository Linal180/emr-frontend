// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// components block
import LocationTable from './LocationTable';
import PageHeader from "../../../../common/PageHeader";
// constants and reducer block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_LOCATION, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_LOCATIONS_ROUTE, FACILITY_LOCATIONS_TEXT, LOCATIONS_TEXT,
} from '../../../../../constants';

const LocationComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const locationsBreadcrumb = { text: LOCATIONS_TEXT, link: '' }

  return (
    <>
      <PageHeader
        hasComponent
        buttonText={ADD_LOCATION}
        title={FACILITY_LOCATIONS_TEXT}
        linkToPage={`${FACILITIES_ROUTE}/${id}${FACILITY_LOCATIONS_ROUTE}/new`}
        path={[FACILITIES_BREAD, locationsBreadcrumb]}
      />

      <LocationTable />
    </>
  )
}

export default LocationComponent;
