// packages block
import { FC, useContext } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import CalendarComponent from "./calendar";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
import DoctorAppointmentsAndPatients from "../../common/Dashboard/DoctorAppointmentsAndPatients";
import ScheduleAvailableComponent from "../../common/Dashboard/scheduleAvailable";
// svgs and constant block
import { RedirectIcon, } from "../../../assets/svgs";
import { TODAYS_APPOINTMENTS, MY_PATIENTS, MY_APPOINTMENTS, } from "../../../constants";
import { AuthContext } from "../../../context";

const DoctorDashboardComponent: FC = (): JSX.Element => {
  const {currentUser} = useContext(AuthContext)
  const { id } = currentUser || {}
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

              <DoctorAppointmentsAndPatients isAppointment providerId={id || ''} />
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

              <DoctorAppointmentsAndPatients providerId={id || ''} />
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

export default DoctorDashboardComponent;
