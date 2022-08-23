// constants block
import PageHeader from "../../../common/PageHeader";
import LabResultsTable from "./LabResultsTable";
import { DASHBOARD_BREAD, LAB_RESULTS_BREAD, LAB_RESULTS_TEXT } from "../../../../constants";

const LabResultsComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={LAB_RESULTS_TEXT}
        path={[DASHBOARD_BREAD, LAB_RESULTS_BREAD]}
        noAdd
      />

      <LabResultsTable />
    </>
  )
}

export default LabResultsComponent;
