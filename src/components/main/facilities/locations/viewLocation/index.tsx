// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// component block
import LocationForm from '../locationForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import { ParamsType } from '../../../../../interfacesTypes';
import {
  FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_LOCATIONS_ROUTE, FACILITY_LOCATION_EDIT_BREAD, LOCATIONS_TEXT,
  UPDATE_LOCATION
} from '../../../../../constants';

const ViewFacilityLocationComponent: FC = (): JSX.Element => {
  const { id, facilityId } = useParams<ParamsType>();
  const locationsBreadcrumb = { text: LOCATIONS_TEXT, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_LOCATIONS_ROUTE}` }

  return (
    <>
      <PageHeader
        title={UPDATE_LOCATION}
        path={[FACILITIES_BREAD, locationsBreadcrumb, FACILITY_LOCATION_EDIT_BREAD]}
      />

      <LocationForm isEdit id={id} />
    </>
  )
};

export default ViewFacilityLocationComponent;
