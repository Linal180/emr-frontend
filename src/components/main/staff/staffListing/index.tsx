// constants block
import { ADD_STAFF, STAFF_BREAD, STAFF_ROUTE, STAFF_TEXT, USERS_BREAD } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import StaffTable from "./StaffTable";

const StaffComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={STAFF_TEXT}
        path={[USERS_BREAD, STAFF_BREAD]}
        hasComponent
        buttonText={ADD_STAFF}
        linkToPage={`${STAFF_ROUTE}/new`}
      />

      <StaffTable />
    </>
  )
}

export default StaffComponent;
