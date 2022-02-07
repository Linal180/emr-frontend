// packages block
import { FC } from 'react';
// components block
import FacilityTable from "./FacilityTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import { ADD_FACILITY, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITIES_TEXT } from "../../../../constants";

const FacilityComponent: FC = (): JSX.Element => (
  <>
    <PageHeader
      title={FACILITIES_TEXT}
      path={[FACILITIES_BREAD]}
      hasComponent
      buttonText={ADD_FACILITY}
      linkToPage={`${FACILITIES_ROUTE}/new`}
    />

    <FacilityTable />
  </>
)

export default FacilityComponent;
