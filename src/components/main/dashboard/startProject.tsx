// packages block
import { useState } from "react";
import { Box, Button, ButtonGroup, Card, Typography } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator,
  DayView, WeekView, AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
// styles, constants  block
import { useCalendarStyles } from "../../../styles/calendarStyles";
import { APPOINTMENT_LIST, CREATE_NEW_APPOINTMENT, DUMMY_APPOINTMENTS } from "../../../constants";


const StartProjectComponent = (): JSX.Element => {
  const classes = useCalendarStyles();
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" py={4}>
        <Typography variant="h4">{APPOINTMENT_LIST}</Typography>
        
        <Button color="primary" variant="contained" startIcon={<Add />}>
          {CREATE_NEW_APPOINTMENT}
        </Button>
      </Box>

      <Card>
        <Box className={classes.appointmentCalendar} p={3}>
          <Scheduler data={DUMMY_APPOINTMENTS}>
            <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
            <MonthView />
            <WeekView />
            <DayView />
            <Toolbar />

            <Box className={classes.buttonView}>
              <ButtonGroup aria-label="primary button group">
                <Button>Month</Button>
                <Button>Week</Button>
                <Button>Day</Button>
              </ButtonGroup>
            </Box>

            <TodayButton />
            <DateNavigator />
            <Appointments />
            <AppointmentTooltip
              showCloseButton
              showOpenButton
            />
          </Scheduler>
        </Box>
      </Card>
    </Box>
  )
};

export default StartProjectComponent;
