// packages block
import { Box, Card } from "@material-ui/core";
import { useContext, useState } from "react";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, DayView, WeekView, AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentCard";
// context, constants block
import { mapAppointmentData } from "../../../utils"
import { AppointmentContext } from "../../../context";

const StartProjectComponent = (): JSX.Element => {
  const { appointmentList } = useContext(AppointmentContext)
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  const Appointment = ({
    children, style, ...restProps
  }: any) => {
    const { data: { color } } = restProps

    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: color,
          borderRadius: '8px',
          whiteSpace: 'normal !important',
          minHeight: 24,
        }}
      >
        {children}
      </Appointments.Appointment>
    )
  };

  return (
    <Card>
      <Box>
        <Scheduler data={mapAppointmentData(appointmentList)}>
          <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
          <MonthView />
          <WeekView />
          <DayView />
          <Toolbar />
          <TodayButton />
          <ViewSwitcher />
          <DateNavigator />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip showCloseButton layoutComponent={AppointmentCard} />
        </Scheduler>
      </Box>
    </Card>
  )
};

export default StartProjectComponent;
