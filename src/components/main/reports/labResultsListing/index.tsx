// constants block
import { DASHBOARD_BREAD, LAB_RESULTS_BREAD, ADD_RESULT, LAB_RESULTS_ROUTE, LAB_RESULTS_TEXT } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import LabResultsTable from "./LabResultsTable";

const LabResultsComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={LAB_RESULTS_TEXT}
        path={[DASHBOARD_BREAD, LAB_RESULTS_BREAD]}
        hasComponent
        buttonText={ADD_RESULT}
        linkToPage={`${LAB_RESULTS_ROUTE}/new`}
      />

      <LabResultsTable />
    </>
  )
}

export default LabResultsComponent;
