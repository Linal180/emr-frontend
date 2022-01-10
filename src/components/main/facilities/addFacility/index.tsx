// packages block
import { FC } from 'react';
// component block
import AddFacilityForm from "./AddFacilityForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_FACILITY, FACILITIES_BREAD, FACILITY_NEW_BREAD } from '../../../../constants';

const AddFacilityComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={ADD_FACILITY}
        path={[FACILITIES_BREAD, FACILITY_NEW_BREAD]}
      />

      <AddFacilityForm />
    </>
  )
};

export default AddFacilityComponent;
