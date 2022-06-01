// components block
import StaffTable from "./StaffTable";
import PageHeader from "../../../common/PageHeader";
// constants, utils and context block
import { ADD_STAFF, STAFF_BREAD, STAFF_ROUTE, STAFF_TEXT, DASHBOARD_BREAD } from "../../../../constants";

const StaffComponent = (): JSX.Element => <>
  <PageHeader
    title={STAFF_TEXT}
    path={[DASHBOARD_BREAD, STAFF_BREAD]}
    hasComponent
    buttonText={ADD_STAFF}
    linkToPage={`${STAFF_ROUTE}/new`}
  />

  <StaffTable />
</>;

export default StaffComponent;
