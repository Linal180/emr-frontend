// packages block
import { FC } from 'react';
// component block
import LocationForm from '../locationForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import {
  ADD_LOCATION, FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD,
  FACILITY_LOCATION_NEW_BREAD
} from '../../../../../constants';

const AddFacilityLocationComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={ADD_LOCATION}
        path={[FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD, FACILITY_LOCATION_NEW_BREAD]}
      />

      <LocationForm />
    </>
  )
};

export default AddFacilityLocationComponent;
