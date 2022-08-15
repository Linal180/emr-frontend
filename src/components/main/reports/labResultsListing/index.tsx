// constants block
import { DASHBOARD_BREAD, LAB_RESULTS_BREAD, LAB_RESULTS_TEXT, SYNC_RESULTS } from "../../../../constants";
import { useSyncLabResultsMutation } from "../../../../generated/graphql";
import Alert from "../../../common/Alert";
import PageHeader from "../../../common/PageHeader";
import LabResultsTable from "./LabResultsTable";

const LabResultsComponent = (): JSX.Element => {
  const [syncLabResults] = useSyncLabResultsMutation({
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  return (
    <>
      <PageHeader
        title={LAB_RESULTS_TEXT}
        path={[DASHBOARD_BREAD, LAB_RESULTS_BREAD]}
        buttonText={SYNC_RESULTS}
        openModal={async () => await syncLabResults()}
      />

      <LabResultsTable />
    </>
  )
}

export default LabResultsComponent;
