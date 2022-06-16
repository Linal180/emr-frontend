// packages block
import { FC, useContext, useEffect } from 'react';
// components block
import FacilityTable from "./FacilityTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import { isUserAdmin } from '../../../../utils';
import { AuthContext } from '../../../../context';
import {
  ADD_FACILITY, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITIES_TEXT, PERMISSION_DENIED, ROOT_ROUTE,
} from "../../../../constants";
import history from '../../../../history';
import Alert from '../../../common/Alert';

const FacilityComponent: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles } = user || {};
  const isAdmin = isUserAdmin(roles)
  const showFacility = isUserAdmin(roles)

  useEffect(() => {
    if(!showFacility){
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [showFacility])

  return (
    <>
      <PageHeader
        title={FACILITIES_TEXT}
        path={[FACILITIES_BREAD]}
        hasComponent={isAdmin}
        buttonText={isAdmin ? ADD_FACILITY : ''}
        linkToPage={isAdmin ? `${FACILITIES_ROUTE}/new` : ''}
      />

      <FacilityTable />
    </>
  )
};

export default FacilityComponent;
