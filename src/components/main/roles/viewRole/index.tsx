// packages block
import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router";
// components block
import RoleForm from "../form";
import Alert from "../../../common/Alert";
// constants and interfaces block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import { ParamsType } from "../../../../interfacesTypes";
import { USER_PERMISSIONS, PERMISSION_DENIED, ROOT_ROUTE } from "../../../../constants";

const ViewRoleComponent: FC = () => {
  const { id } = useParams<ParamsType>()
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updateRole)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

  return (
    <RoleForm isEdit id={id} />
  )
}

export default ViewRoleComponent;
