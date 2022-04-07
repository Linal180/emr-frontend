// packages block
import { FC, useContext, useEffect } from 'react';
// component block
import Alert from '../../../common/Alert';
import PracticeForm from "../practiceForm";
import PageHeader from '../../../common/PageHeader';
// constants, utils block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { PERMISSION_DENIED, PRACTICE_MANAGEMENT_TEXT, ROOT_ROUTE, USER_PERMISSIONS } from '../../../../constants';

const AddPracticeComponent: FC = (): JSX.Element => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createPractice)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader title={PRACTICE_MANAGEMENT_TEXT} />

      <PracticeForm />
    </>
  )
};

export default AddPracticeComponent;
