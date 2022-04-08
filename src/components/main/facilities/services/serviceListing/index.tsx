// packages block
import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
// components block
import ServicesTable from './ServiceTable';
import Alert from '../../../../common/Alert';
import PageHeader from '../../../../common/PageHeader';
// constants block / generated
import history from '../../../../../history';
import { AuthContext } from '../../../../../context';
import { checkPermission } from '../../../../../utils';
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY_SERVICES_TEXT,
  PERMISSION_DENIED, ROOT_ROUTE, SERVICES, USER_PERMISSIONS
} from "../../../../../constants";

const FacilityServicesComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const servicesBreadcrumb = { text: SERVICES, link: '' }
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.findAllServices)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <>
      <PageHeader
        hasComponent
        buttonText={ADD_SERVICE}
        title={FACILITY_SERVICES_TEXT}
        path={[FACILITIES_BREAD, servicesBreadcrumb]}
        linkToPage={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}/new`}
      />

      <ServicesTable />
    </>
  )
}

export default FacilityServicesComponent;
