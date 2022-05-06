// packages block
import { FC, useContext } from 'react';
// components block
import FacilityTable from "./FacilityTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import { isUserAdmin } from '../../../../utils';
import { AuthContext } from '../../../../context';
import {
  ADD_FACILITY, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITIES_TEXT,
} from "../../../../constants";

const FacilityComponent: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles } = user || {};
  const isAdmin = isUserAdmin(roles)

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
