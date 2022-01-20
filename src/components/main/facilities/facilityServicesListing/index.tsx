// packages block
import { FC } from 'react';
// components block
import FacilityServicesTable from "./FacilityServicesTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import { ADD_SERVICE, FACILITY_SERVICES_BREAD, FACILITY_SERVICES_TEXT } from "../../../../constants";

const FacilityServicesComponent: FC = (): JSX.Element => (
  <>
    <PageHeader
      title={FACILITY_SERVICES_TEXT}
      path={[FACILITY_SERVICES_BREAD]}
      hasComponent
      buttonText={ADD_SERVICE}
      openModel
    />

    <FacilityServicesTable />
  </>
)

export default FacilityServicesComponent;
