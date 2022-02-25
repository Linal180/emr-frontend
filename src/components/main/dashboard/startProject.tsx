// packages block
import { useState } from "react";
import { Box, Card } from "@material-ui/core";
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator,
  DayView, WeekView, AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./AppointmentCard";
// styles, constants  block
import { DUMMY_APPOINTMENTS } from "../../../constants";


const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [data, setData] = useState<any>(DUMMY_APPOINTMENTS)

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  const commitChanges = (item: any): void => {
    let data1: any;
    if (item.changed) {
      data1 = data.map((item: { changed: { [x: string]: any; }; id: string | number; }) => (
        item.changed[item.id] ? { ...item, ...item.changed[item.id] } : item));
    }
    if (item.deleted !== undefined) {
      data1 = data.filter((appointment: { id: any; }) => appointment.id !== item.deleted);
    }
    setData(data1)
  }

  return (
    <Card>
      <Box>
        <Scheduler data={DUMMY_APPOINTMENTS}>
          <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
          <EditingState
            onCommitChanges={commitChanges}
          />

          <MonthView />
          <IntegratedEditing />
          <WeekView />
          <DayView />
          <Toolbar />
          <TodayButton />
          <ViewSwitcher />
          <DateNavigator />
          {/* <ConfirmationDialog overlayComponent={AppointmentCard} /> */}
          <Appointments />
          <AppointmentTooltip showCloseButton
            layoutComponent={AppointmentCard}
          />

          {/* <AppointmentForm overlayComponent={AppointmentCard} /> */}
        </Scheduler>
      </Box>
    </Card>
  )
};

export default StartProjectComponent;
