// packages block
// component block
import RolesTable from './RolesTable';
import PageHeader from '../../common/PageHeader';
// constants, history, styling block
import { ADD_NEW_TEXT, ADD_ROLES_ROUTE, ROLES_TEXT, } from '../../../constants';


const RolesComponent = (): JSX.Element => {

  return (
    <>
      <PageHeader
        title={ROLES_TEXT}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        linkToPage={ADD_ROLES_ROUTE}
      />

      <RolesTable />
    </>
  )
}
export default RolesComponent;
