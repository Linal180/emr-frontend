// packages block
import { FC } from "react";
// components block
import PageHeader from "../../../common/PageHeader";
import AppointmentsTable from "../../../common/AppointmentsTable";
// constants block
import { AppointmentListProps } from "../../../../interfacesTypes";
import {
  ADD_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, APPOINTMENTS_ROUTE, APPOINTMENT_TEXT, DASHBOARD_BREAD
} from "../../../../constants";

const AppointmentsComponent: FC<AppointmentListProps> = ({ showHeader }): JSX.Element => <>
  {showHeader &&
    <PageHeader
      hasComponent
      title={APPOINTMENT_TEXT}
      buttonText={ADD_APPOINTMENT}
      linkToPage={`${APPOINTMENTS_ROUTE}/new`}
      path={[DASHBOARD_BREAD, VIEW_APPOINTMENTS_BREAD]}
    />
  }

  <AppointmentsTable />
</>;

export default AppointmentsComponent;
