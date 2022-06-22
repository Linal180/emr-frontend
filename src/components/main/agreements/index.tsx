// components block
import PageHeader from '../../common/PageHeader';
import AgreementsTable from './agreementsTable';
//constants bock
import { ADD_AGREEMENT, AGREEMENTS, AGREEMENTS_BREAD, AGREEMENTS_ROUTE, DASHBOARD_BREAD } from '../../../constants';

const AgreementsComponent = (): JSX.Element => {

  return (
    <>
      <PageHeader
        title={AGREEMENTS}
        path={[DASHBOARD_BREAD, AGREEMENTS_BREAD]}
        hasComponent
        buttonText={ADD_AGREEMENT}
        linkToPage={`${AGREEMENTS_ROUTE}/new`}
      />

      <AgreementsTable />
    </>
  )
}

export default AgreementsComponent;
