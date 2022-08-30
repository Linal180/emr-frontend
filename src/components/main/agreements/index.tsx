//packages block
import { useContext } from 'react';
// components block
import PageHeader from '../../common/PageHeader';
import AgreementsTable from './agreementsTable';
//constants bock
import { AuthContext } from '../../../context';
import { checkPermission } from '../../../utils';
import {
  ADD_AGREEMENT, AGREEMENTS, AGREEMENTS_BREAD, AGREEMENTS_ROUTE, DASHBOARD_BREAD, USER_PERMISSIONS
} from '../../../constants';

const AgreementsComponent = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext);
  const canAdd = checkPermission(userPermissions, USER_PERMISSIONS.createAgreement)

  return (
    <>
      <PageHeader
        title={AGREEMENTS}
        path={[DASHBOARD_BREAD, AGREEMENTS_BREAD]}
        hasComponent
        buttonText={ADD_AGREEMENT}
        linkToPage={`${AGREEMENTS_ROUTE}/new`}
        noAdd={!canAdd}
      />

      <AgreementsTable />
    </>
  )
}

export default AgreementsComponent;
