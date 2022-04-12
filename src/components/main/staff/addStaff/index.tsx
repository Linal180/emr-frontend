// packages block
import { FC } from 'react';
// component block
import StaffForm from "../staffForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import { ADD_STAFF, STAFF_BREAD, STAFF_NEW_BREAD, USERS_BREAD } from '../../../../constants';

const AddStaffComponent: FC = () => <>
  <PageHeader
    title={ADD_STAFF}
    path={[USERS_BREAD, STAFF_BREAD, STAFF_NEW_BREAD]}
  />

  <StaffForm />
</>;

export default AddStaffComponent;
