// packages block
import { FC } from 'react';
// component block
import FacilityForm from "../facilityForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_FACILITY, FACILITIES_BREAD, FACILITY_NEW_BREAD } from '../../../../constants';

const AddFacilityComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={ADD_FACILITY}
        path={[FACILITIES_BREAD, FACILITY_NEW_BREAD]}
      />

      <FacilityForm />
    </>
  )
};

export default AddFacilityComponent;
