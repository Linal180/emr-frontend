import { FC, Fragment } from "react";
//components block
import PageHeader from "../../common/PageHeader";
import PatientEligibility from "./patientEligibility";
//constants
import { DASHBOARD_BREAD, INSURANCE_ELIGIBILITY_TEXT, INSURANCE_ELIGIBILITY_TEXT_BREAD } from "../../../constants";

const InsuranceEligibility: FC = (): JSX.Element => {

  return (<Fragment>
    <PageHeader
      title={INSURANCE_ELIGIBILITY_TEXT}
      path={[DASHBOARD_BREAD, INSURANCE_ELIGIBILITY_TEXT_BREAD]}
      noAdd={true}
    />
    <PatientEligibility />
  </Fragment>
  )

}

export default InsuranceEligibility