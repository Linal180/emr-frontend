// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// component block
import Alert from '../../../common/Alert';
import PracticeForm from "../practiceForm";
import PageHeader from '../../../common/PageHeader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { checkPermission } from '../../../../utils';
import { ParamsType } from '../../../../interfacesTypes';
import { PERMISSION_DENIED, PRACTICE_MANAGEMENT_TEXT, ROOT_ROUTE, USER_PERMISSIONS } from '../../../../constants';

const ViewPracticeComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
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

      <PracticeForm isEdit id={id} />
    </>
  )
};

export default ViewPracticeComponent;
