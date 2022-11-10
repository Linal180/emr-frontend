// constants block
import { DASHBOARD_BREAD, INVOICES_TEXT, INVOICES_BREAD } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import ReceivablesTable from "../../patients/patientDetail/receivables";

const InvoicesComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader title={INVOICES_TEXT} path={[DASHBOARD_BREAD, INVOICES_BREAD]} />
      <ReceivablesTable />
    </>
  )
}

export default InvoicesComponent;
