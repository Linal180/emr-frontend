// constants block
import { BILLING_BREAD, INVOICES_TEXT, INVOICES_BREAD } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";

const InvoicesComponent = (): JSX.Element => {
  return (<PageHeader title={INVOICES_TEXT} path={[BILLING_BREAD, INVOICES_BREAD]} />)
}

export default InvoicesComponent;
