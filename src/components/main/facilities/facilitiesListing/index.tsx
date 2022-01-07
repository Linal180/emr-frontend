// components block
import MainLayout from "../../../common/MainLayout";
// constants block
import FacilityTable from "./FacilityTable";
import { ADD_FACILITY, FACILITIES_LISTING, FACILITIES_ROUTE, FACILITIES_TEXT } from "../../../../constants";

const FacilityComponent = (): JSX.Element => {
  const breadcrumb = {
    hasButton: true,
    title: FACILITIES_TEXT,
    buttonText: ADD_FACILITY,
    link: `${FACILITIES_ROUTE}/new`,
    path: [FACILITIES_TEXT, FACILITIES_LISTING],
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <FacilityTable />
    </MainLayout>
  )
};

export default FacilityComponent;
