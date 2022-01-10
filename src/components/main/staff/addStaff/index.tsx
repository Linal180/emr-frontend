// packages block
import { FC } from 'react';
// component block
import AddStaffForm from "./AddStaffForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_STAFF, STAFF_BREAD, STAFF_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddStaffComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={ADD_STAFF}
        path={[USERS_BREAD, STAFF_BREAD, STAFF_NEW_BREAD]}
      />

      <AddStaffForm />
    </>
  )
};

export default AddStaffComponent;
