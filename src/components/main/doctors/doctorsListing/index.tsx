// packages block
import { FC } from "react";
// components block
import DoctorsTable from "./DoctorsTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import {
  ADD_DOCTOR, DOCTORS_BREAD, DOCTORS_ROUTE, DOCTORS_TEXT, DASHBOARD_BREAD,
} from "../../../../constants";

const DoctorsComponent: FC = (): JSX.Element => <>
  <PageHeader
    hasComponent
    title={DOCTORS_TEXT}
    buttonText={ADD_DOCTOR}
    path={[DASHBOARD_BREAD, DOCTORS_BREAD]}
    linkToPage={`${DOCTORS_ROUTE}/new`}
  />

  <DoctorsTable />
</>;

export default DoctorsComponent;
