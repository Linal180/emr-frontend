// constants block
import PageHeader from "../../../common/PageHeader";
import LabResultsTable from "./LabResultsTable";
import { DASHBOARD_BREAD, LAB_RESULTS_BREAD, LAB_RESULTS_TEXT, SETTINGS_ROUTE } from "../../../../constants";
import { Box } from "@material-ui/core";
import BackButton from "../../../common/BackButton";

const LabResultsComponent = (): JSX.Element => {
  return (
    <>
      <Box display='flex'>
        <BackButton to={`${SETTINGS_ROUTE}`} />

        <Box ml={2}>
          <PageHeader
            title={LAB_RESULTS_TEXT}
            path={[DASHBOARD_BREAD, LAB_RESULTS_BREAD]}
            noAdd
          />
        </Box>
      </Box>

      <LabResultsTable />
    </>
  )
}

export default LabResultsComponent;
