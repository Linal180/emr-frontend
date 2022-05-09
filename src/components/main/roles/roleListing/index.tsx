// component block
import RolesTable from './RolesTable';
import PageHeader from '../../../common/PageHeader';
// constants, history, styling block
import {
  ADD_NEW_TEXT, ADD_ROLES_ROUTE, ROLES_BREAD, ROLES_TEXT,
} from '../../../../constants';

const RolesComponent = (): JSX.Element => <>
  <PageHeader
    title={ROLES_TEXT}
    path={[ROLES_BREAD]}
    hasComponent
    buttonText={ADD_NEW_TEXT}
    linkToPage={ADD_ROLES_ROUTE}
  />

  <RolesTable />
</>;

export default RolesComponent;
