// packages block
import { FC } from "react";
import { useParams } from "react-router";
import { ParamsType } from "../../../../interfacesTypes";
// components block
import RoleForm from "../form";
// constants block

const ViewRoleComponent: FC = () => {
  const { id } = useParams<ParamsType>()

  return (
    <RoleForm isEdit id={id} />
  )
}

export default ViewRoleComponent;
