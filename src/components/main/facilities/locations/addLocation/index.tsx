// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import LocationForm from '../locationForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_LOCATION, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_LOCATIONS_ROUTE, FACILITY_LOCATION_NEW_BREAD,
  LOCATIONS_TEXT
} from '../../../../../constants';

const AddFacilityLocationComponent: FC = (): JSX.Element => {
  const { facilityId } = useParams<ParamsType>();
  const locationsBreadcrumb = { text: LOCATIONS_TEXT, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_LOCATIONS_ROUTE}` }

  return (
    <>
      <PageHeader
        title={ADD_LOCATION}
        path={[FACILITIES_BREAD, locationsBreadcrumb, FACILITY_LOCATION_NEW_BREAD]}
      />

      <LocationForm />
    </>
  )
};

export default AddFacilityLocationComponent;
