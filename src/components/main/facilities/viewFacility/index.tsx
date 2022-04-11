// packages block
import { FC } from "react";
import { useParams } from "react-router";
// component block
import UpdateFacilityForm from "../facilityForm";
// constant block
import { ParamsType } from "../../../../interfacesTypes";

const ViewFacilityComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <UpdateFacilityForm id={id} isEdit />
  )
};

export default ViewFacilityComponent;
