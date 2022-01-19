// constants block
import { CLAIM_FEED_TEXT, CLAIMS_ROUTE, BILLING_BREAD, CLAIM_FEED_BREAD, ADD_BILL } from "../../../../constants";
import PageHeader from "../../../common/PageHeader";
import ClaimFeedTable from "./ClaimFeedTable";

const ClaimFeedComponent = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={CLAIM_FEED_TEXT}
        path={[BILLING_BREAD, CLAIM_FEED_BREAD]}
        hasComponent
        buttonText={ADD_BILL}
        linkToPage={`${CLAIMS_ROUTE}/new`}
      />

      <ClaimFeedTable />
    </>
  )
}

export default ClaimFeedComponent;
