// components block
import MainLayout from "../../../common/MainLayout";
import PageHeader from "../../../common/PageHeader";
// constants block
import FacilityTable from "./FacilityTable";
import { ADD_FACILITY, FACILITIES_TEXT } from "../../../../constants";

const UsersComponent = (): JSX.Element => (
  <MainLayout>
    <PageHeader
      title={FACILITIES_TEXT}
      buttonText={ADD_FACILITY}
      hasComponent
    />

    <FacilityTable />
  </MainLayout>
);

export default UsersComponent;
