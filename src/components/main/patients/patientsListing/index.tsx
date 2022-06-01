// components block
import PatientsTable from "./PatientsTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import {
  ADD_PATIENT, PATIENTS_BREAD, PATIENTS_ROUTE, PATIENTS_TEXT, DASHBOARD_BREAD,
} from "../../../../constants";

const LabResultsComponent = (): JSX.Element => <>
  <PageHeader
    title={PATIENTS_TEXT}
    path={[DASHBOARD_BREAD, PATIENTS_BREAD]}
    hasComponent
    buttonText={ADD_PATIENT}
    linkToPage={`${PATIENTS_ROUTE}/new`}
  />

  <PatientsTable />
</>;

export default LabResultsComponent;
