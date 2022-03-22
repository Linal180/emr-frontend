// packages block
// component block
// constants, history, styling block
import { ADD_NEW_TEXT, ROLES_TEXT, } from '../../../constants';
import PageHeader from '../../common/PageHeader';
import RolesTable from './RolesTable';


const RolesComponent = (): JSX.Element => {

  return (
    <>
      <PageHeader
        title={ROLES_TEXT}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        linkToPage={''}
      />

      <RolesTable />
    </>
  )
}
export default RolesComponent;