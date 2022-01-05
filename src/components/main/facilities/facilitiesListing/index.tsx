// components block
import MainLayout from "../../../common/MainLayout";
import PageHeader from "../../../common/PageHeader";
// constants block
import { FACILITIES_TEXT } from "../../../../constants";

const UsersComponent = (): JSX.Element => (
  <MainLayout>
    <PageHeader
      title={FACILITIES_TEXT}
      buttonText="Add Facilities"
      hasComponent
    />

    <h1>Facilities List</h1>
  </MainLayout>
);

export default UsersComponent;
