// packages block
import { FC } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import CalendarComponent from "./calendar";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
import AppointmentListComponent from "../../common/Dashboard/appointmentList";
import ScheduleAvailableComponent from "../../common/Dashboard/scheduleAvailable";
// svgs block, styles, history
import { RedirectIcon, } from "../../../assets/svgs";
// constant
import { TODAYS_APPOINTMENTS, MY_PATIENTS, MY_APPOINTMENTS, } from "../../../constants";

const DoctorAdminDashboardComponent: FC = (): JSX.Element => {

  return (
    <>
      <PatientSearchComponent />

      <Grid container spacing={3}>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box p={3} pb={2}>
              <Typography variant="h5">{MY_APPOINTMENTS}</Typography>
            
              <CalendarComponent showHeader={false} />
            </Box>
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box px={3} pb={2}>
              <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{TODAYS_APPOINTMENTS}</Typography>

                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Box>

              <AppointmentListComponent />
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3} pb={2}>
              <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{MY_PATIENTS}</Typography>

                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Box>

              <AppointmentListComponent />
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3}>
              <ScheduleAvailableComponent />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};

export default DoctorAdminDashboardComponent;
