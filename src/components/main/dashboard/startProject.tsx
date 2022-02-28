// packages block
import { useState } from "react";
import { Box, Card } from "@material-ui/core";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator,
  DayView, WeekView, AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentCard";
// styles, constants  block
import { DUMMY_APPOINTMENTS } from "../../../constants";


const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  return (
    <Card>
      <Box>
        <Scheduler data={DUMMY_APPOINTMENTS}>
          <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
          <MonthView />
          <WeekView />
          <DayView />
          <Toolbar />
          <TodayButton />
          <ViewSwitcher />
          <DateNavigator />
          <Appointments />
          <AppointmentTooltip showCloseButton layoutComponent={AppointmentCard} />
        </Scheduler>
      </Box>
    </Card>
  )
};

export default StartProjectComponent;
