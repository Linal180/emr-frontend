// components block
import PageHeader from "../../../common/PageHeader";
// constants block
import { APPOINTMENT_TEXT, APPOINTMENTS_BREAD, SCHEDULE_APPOINTMENTS_BREAD } from "../../../../constants";

const ScheduleAppointmentsComponent = (): JSX.Element => {
  return <PageHeader title={APPOINTMENT_TEXT} path={[APPOINTMENTS_BREAD, SCHEDULE_APPOINTMENTS_BREAD]} />
}

export default ScheduleAppointmentsComponent;
