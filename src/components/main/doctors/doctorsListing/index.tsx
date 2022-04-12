// packages block
import { FC } from "react";
// components block
import DoctorsTable from "./DoctorsTable";
import PageHeader from "../../../common/PageHeader";
// constants block
import {
  ADD_DOCTOR, DOCTORS_BREAD, DOCTORS_ROUTE, DOCTORS_TEXT, USERS_BREAD,
} from "../../../../constants";

const DoctorsComponent: FC = (): JSX.Element => <>
  <PageHeader
    hasComponent
    title={DOCTORS_TEXT}
    buttonText={ADD_DOCTOR}
    path={[USERS_BREAD, DOCTORS_BREAD]}
    linkToPage={`${DOCTORS_ROUTE}/new`}
  />

  <DoctorsTable />
</>;

export default DoctorsComponent;
