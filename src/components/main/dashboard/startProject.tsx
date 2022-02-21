// packages block
import { useState } from "react";
import { Add, FilterList } from '@material-ui/icons';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Box, Button, Card, Grid, Typography } from "@material-ui/core";
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, ViewSwitcher,
  DayView, WeekView, AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
// components block
import AppointmentCard from "./AppointmentCard";
import PageHeader from "../../common/PageHeader";
import ViewAppointmentLoader from "../../common/ViewAppointmentLoader";
// constants block
import { GRAY_SIX } from "../../../theme";
import { DASHBOARD_TEXT, DUMMY_APPOINTMENTS } from "../../../constants";



const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState("2018-07-27")

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  return (
    <Box>
      <PageHeader title={DASHBOARD_TEXT} subTitle="Molestie imperdiet purus neque neque." />

      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={1.4} borderBottom={`1px solid ${GRAY_SIX}`}>
              <Typography variant="h4">Basic Calendar</Typography>

              <Box display="flex" gridGap={16}>
                <Button color="default" variant="outlined" startIcon={<FilterList />}>Filter</Button>
                <Button color="primary" variant="contained" startIcon={<Add />}>Add New</Button>
              </Box>
            </Box>

            <Box>
              <Scheduler data={DUMMY_APPOINTMENTS}>
                <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
                <MonthView />
                <WeekView />
                <DayView />
                <Toolbar />
                <ViewSwitcher />
                <DateNavigator />
                <TodayButton />
                <Appointments />
                <AppointmentTooltip
                  showCloseButton
                  showOpenButton
                />
              </Scheduler>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <AppointmentCard />
          <ViewAppointmentLoader rows={0} hasMedia={false} columns={"auto"} />
        </Grid>
      </Grid>
    </Box>
  )
};

export default StartProjectComponent;
