// packages block
import { FC } from 'react';
// components block
import LocationTable from './LocationTable';
import PageHeader from "../../../../common/PageHeader";
// constants block
import { ADD_LOCATION, FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD, FACILITY_LOCATIONS_TEXT } from '../../../../../constants';

const LocationComponent: FC = (): JSX.Element => (
  <>
    <PageHeader
      title={FACILITY_LOCATIONS_TEXT}
      path={[FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD]}
      hasComponent
      buttonText={ADD_LOCATION}
    />

    <LocationTable />
  </>
)

export default LocationComponent;
