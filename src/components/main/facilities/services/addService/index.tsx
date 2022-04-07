// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// component block
import ServiceForm from '../serviceForm';
import Alert from '../../../../common/Alert';
import PageHeader from '../../../../common/PageHeader';
// constants block
import history from '../../../../../history';
import { AuthContext } from '../../../../../context';
import { checkPermission } from '../../../../../utils';
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY_SERVICE_NEW_BREAD,
  PERMISSION_DENIED, ROOT_ROUTE, SERVICES, USER_PERMISSIONS
} from '../../../../../constants';

const AddFacilityServiceComponent: FC = (): JSX.Element => {
  const { facilityId } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)
  const servicesBreadcrumb = {
    text: SERVICES, link: `${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}`
  }

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createService)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        title={ADD_SERVICE}
        path={[FACILITIES_BREAD, servicesBreadcrumb, FACILITY_SERVICE_NEW_BREAD]}
      />

      <ServiceForm />
    </>
  )
};

export default AddFacilityServiceComponent;
