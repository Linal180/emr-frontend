// packages block
import { FC } from "react";
import { useParams } from "react-router";
// component block
import UpdateFacilityForm from "../facilityForm";
import PageHeader from "../../../common/PageHeader";
// constant block
import { ParamsType } from "../../../../interfacesTypes";
import { FACILITIES_BREAD, FACILITY_EDIT_BREAD, VIEW_FACILITY } from "../../../../constants";

const ViewFacilityComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <>
      <PageHeader
        title={VIEW_FACILITY}
        path={[FACILITIES_BREAD, FACILITY_EDIT_BREAD]}
      />

      <UpdateFacilityForm id={id} isEdit />
    </>
  )
};

export default ViewFacilityComponent;
