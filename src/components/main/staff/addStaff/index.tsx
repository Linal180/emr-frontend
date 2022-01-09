// packages block
import { FC } from 'react';
import { ADD_STAFF, STAFF_BREAD, STAFF_NEW_BREAD, USERS_BREAD } from '../../../../constants';
import PageHeader from '../../../common/PageHeader';
// component block
import AddStaffForm from "./AddStaffForm";

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
