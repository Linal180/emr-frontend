// packages block
import { FC } from "react";
// components block
import PageHeader from "../../../common/PageHeader";
import AppointmentsTable from "../../../common/AppointmentsTable";
// constants block
import { ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_ROUTE, APPOINTMENT_TEXT, DASHBOARD_BREAD, } from "../../../../constants";

const AppointmentsComponent: FC = (): JSX.Element => <>
  <PageHeader
    title={APPOINTMENT_TEXT}
    path={[DASHBOARD_BREAD, VIEW_APPOINTMENTS_BREAD]}
    hasComponent
    buttonText={ADD_APPOINTMENT}
    linkToPage={`${APPOINTMENTS_ROUTE}/new`}
  />

  <AppointmentsTable />
</>;

export default AppointmentsComponent;
