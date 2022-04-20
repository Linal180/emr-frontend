// packages block
import { FC } from "react";
import { useParams } from "react-router";
// components block
import RoleForm from "../form";
// constants and interfaces block
import { ParamsType } from "../../../../interfacesTypes";

const ViewRoleComponent: FC = () => {
  const { id } = useParams<ParamsType>()

  return (
    <RoleForm isEdit id={id} />
  )
}

export default ViewRoleComponent;
