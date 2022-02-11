// packages block
import { FC } from "react";
import { Box } from "@material-ui/core";
// components block
import ScheduleAppointmentsPublic from "../../../components/main/publicAppointments/scheduleAppointments/publicAppointmentForm";
// theme block
import { WHITE_TWO } from "../../../theme";

const AppointmentPublic: FC = (): JSX.Element => (
  <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}>
    <ScheduleAppointmentsPublic />
  </Box>
);

export default AppointmentPublic;
