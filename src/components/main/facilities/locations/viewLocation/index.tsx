// packages block
import { FC } from 'react';
// component block
import LocationForm from '../locationForm';
import PageHeader from '../../../../common/PageHeader';
// constants block
import {
  FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD,
  FACILITY_LOCATION_EDIT_BREAD,
  UPDATE_LOCATION
} from '../../../../../constants';
import { useParams } from 'react-router';
import { ParamsType } from '../../../../../interfacesTypes';

const ViewFacilityLocationComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={UPDATE_LOCATION}
        path={[FACILITIES_BREAD, FACILITY_LOCATIONS_BREAD, FACILITY_LOCATION_EDIT_BREAD]}
      />

      <LocationForm isEdit id={id} />
    </>
  )
};

export default ViewFacilityLocationComponent;
