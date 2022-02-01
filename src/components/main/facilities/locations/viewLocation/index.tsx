// packages block
import { FC } from 'react';
// component block
import LocationForm from '../locationForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import {
  ADD_LOCATION, FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD,
  FACILITY_LOCATION_EDIT_BREAD
} from '../../../../../constants';
import { useParams } from 'react-router';
import { ParamsType } from '../../../../../interfacesTypes';

const ViewFacilityLocationComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={ADD_LOCATION}
        path={[FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD, FACILITY_LOCATION_EDIT_BREAD]}
      />

      <LocationForm isEdit id={id} />
    </>
  )
};

export default ViewFacilityLocationComponent;
