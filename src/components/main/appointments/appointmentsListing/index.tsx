// packages block
import { FC } from "react";
// components block
import PageHeader from "../../../common/PageHeader";
import AppointmentsTable from "./AppointmentsTable";
// constants block
import {
  ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_ROUTE, APPOINTMENT_TEXT,
  APPOINTMENTS_BREAD
} from "../../../../constants";

const AppointmentsComponent: FC = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title={APPOINTMENT_TEXT}
        path={[APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_BREAD]}
        hasComponent
        buttonText={ADD_APPOINTMENT}
        linkToPage={`${APPOINTMENTS_ROUTE}/new`}
      />

      <AppointmentsTable />
    </>
  )
}

export default AppointmentsComponent;
