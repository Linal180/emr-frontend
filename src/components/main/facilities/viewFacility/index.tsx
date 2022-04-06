// packages block
import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router";
// component block
import Alert from "../../../common/Alert";
import UpdateFacilityForm from "../facilityForm";
import PageHeader from "../../../common/PageHeader";
// constant block
import history from "../../../../history";
import { AuthContext } from "../../../../context";
import { checkPermission } from "../../../../utils";
import { ParamsType } from "../../../../interfacesTypes";
import { FACILITIES_BREAD, FACILITY_EDIT_BREAD, PERMISSION_DENIED, ROOT_ROUTE, USER_PERMISSIONS, VIEW_FACILITY } from "../../../../constants";

const ViewFacilityComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.updateFacility)) {
      Alert.error(PERMISSION_DENIED)
      history.push(ROOT_ROUTE)
    }
  }, [userPermissions]);

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
