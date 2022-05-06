//  packages block
import { useParams } from "react-router";
// component block
import StaffForm from "../staffForm";
// constant block
import { ParamsType } from "../../../../interfacesTypes";

const ViewStaffComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>();

  return (
    <StaffForm id={id} isEdit />
  )
};

export default ViewStaffComponent;
