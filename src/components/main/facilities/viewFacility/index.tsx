// packages block
import { FC } from "react";
// component block
import PageHeader from "../../../common/PageHeader";
import UpdateFacilityForm from "./UpdateFacilityForm";
// constant block
import { FACILITIES_BREAD, STAFF_EDIT_BREAD, VIEW_FACILITY } from "../../../../constants";

const ViewFacilityComponent: FC = () => {
  return (
    <>
      <PageHeader
        title={VIEW_FACILITY}
        path={[FACILITIES_BREAD, STAFF_EDIT_BREAD]}
      />

      <UpdateFacilityForm />
    </>
  )
};

export default ViewFacilityComponent;
