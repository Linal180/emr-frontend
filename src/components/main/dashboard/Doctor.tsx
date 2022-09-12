// packages block
import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import CalendarComponent from "./calendar";
import ScheduleListing from "../../common/scheduling/Listing";
import FacilityDoctorPatients from "../../common/Dashboard/FacilityDoctorPatients";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
import DoctorAppointmentsAndPatients from "../../common/Dashboard/DoctorAppointmentsAndPatients";
// svgs and constant block
import { AuthContext } from "../../../context";
import history from "../../../history";
import { MessageIcon, RedirectIcon, } from "../../../assets/svgs";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  TODAYS_APPOINTMENTS, MY_PATIENTS, MY_APPOINTMENTS, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE,
  SEND_SMS, SEND_SMS_ROUTE, QUICK_ACTIONS
} from "../../../constants";
import { WHITE } from "../../../theme";

const DoctorDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  const { currentUser } = useContext(AuthContext)
  const { id, facility } = currentUser || {}
  const { id: facilityId } = facility || {}

  return (
    <>
      <PatientSearchComponent />

      <Grid container spacing={2}>
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
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box pb={3} className={classes.cardContainer}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Box className={classes.cardBox} onClick={() => history.push(SEND_SMS_ROUTE)}>
                  <MessageIcon />

                  <Box p={0.2} />

                  <Typography variant="h6">{SEND_SMS}</Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          <Box p={1} />

          <Card>
            <Box px={3} pb={2}>
              <Box mb={1} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{TODAYS_APPOINTMENTS}</Typography>

                <Link to={VIEW_APPOINTMENTS_ROUTE}>
                  <IconButton size='small'>
                    <RedirectIcon />
                  </IconButton>
                </Link>
              </Box>

              <DoctorAppointmentsAndPatients providerId={id || ''} />
            </Box>
          </Card>

          <Box p={1} />

          <Card>
            <Box px={3} pb={2}>
              <Box mb={1} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{MY_PATIENTS}</Typography>

                <Link to={PATIENTS_ROUTE}>
                  <IconButton size='small'>
                    <RedirectIcon />
                  </IconButton>
                </Link>
              </Box>

              <FacilityDoctorPatients providerId={id || ''} />
            </Box>
          </Card>

          <Box p={1} />

          <ScheduleListing doctorId={id || ''} isDoctor doctorFacilityId={facilityId || ''} />

        </Grid>
      </Grid>
    </>
  )
};

export default DoctorDashboardComponent;
