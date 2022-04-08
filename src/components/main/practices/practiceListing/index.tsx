// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import PracticeTable from './PracticeTable';
import PageHeader from '../../../common/PageHeader';
import Alert from '../../../common/Alert';
// context, utils and constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import {
  ADD_NEW_PRACTICE_TEXT, PERMISSION_DENIED, PRACTICE_MANAGEMENT_ROUTE, PRACTICE_MANAGEMENT_TEXT,
  ROOT_ROUTE, USER_PERMISSIONS
} from '../../../../constants';

const PracticeListingComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createPractice)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        hasComponent
        title={PRACTICE_MANAGEMENT_TEXT}
        linkToPage={`${PRACTICE_MANAGEMENT_ROUTE}/new`}
        buttonText={ADD_NEW_PRACTICE_TEXT}
      />

      <PracticeTable />
    </>
  )
};

export default PracticeListingComponent;
