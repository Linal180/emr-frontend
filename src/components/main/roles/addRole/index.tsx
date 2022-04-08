// packages block
import { FC, useContext, useEffect } from "react";
// components block
import RoleForm from "../form";
import Alert from "../../../common/Alert";
// constants block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import { USER_PERMISSIONS, PERMISSION_DENIED, ROOT_ROUTE } from "../../../../constants";

const AddRole: FC = () => {
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createRole)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);
  
  return (
    <RoleForm />
  )
}

export default AddRole;
