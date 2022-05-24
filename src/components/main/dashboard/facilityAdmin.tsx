// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import PieChart3Component from "../../common/charts/pieChart3";
import PieChart4Component from "../../common/charts/pieChart4";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
import MedicalBillingComponent from "../../common/Dashboard/medicalBilling";
import AppointmentListComponent from "../../common/Dashboard/appointmentList";
import ScheduleAvailableComponent from "../../common/Dashboard/scheduleAvailable";
import { BLUE, BLUE_SEVEN, GREEN_ONE, WHITE, GREEN, PURPLE_ONE, GRAY_SEVEN, } from "../../../theme";
// svgs block, styles, history
import history from "../../../history";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  CalendarBlackIcon, CalendarWhiteIcon, PracticeActiveIcon, ProviderWhiteIcon, RedirectIcon, StaffWhiteIcon, UserBlackIcon,
  UserBlackIconTwo, UserOutlinedIcon,
} from "../../../assets/svgs";
// constant
import {
  QUICK_ACTIONS, EMERGENCY_ACCESS_ROUTE, FACILITIES_ROUTE, PATIENTS_ROUTE, PRACTICE_DETAILS_ROUTE, TODAYS_APPOINTMENTS,
  ACTIVE_PROVIDERS_IN_CURRENT_SHIFT, ACTIVE_STAFF_IN_CURRENT_SHIFT, TOTAL_NUMBER_OF_USERS, AVAILABLE_USERS_IN_CURRENT_SHIFT,
  NEW_STAFF, NEW_PROVIDER, NEW_PATIENT, NEW_APPOINTMENT, TOTAL_APPOINTMENTS, TOTAL_DISCHARGED_PATIENTS, AGAINST_TOTAL_APPOINTMENTS,
  PATIENT_DISCHARGED, UPCOMING_APPOINTMENTS, RECENTLY_ADDED_PATIENTS, ADDED_PATIENTS_LIST, DOCTORS_ROUTE, STAFF_ROUTE, APPOINTMENTS_ROUTE,
} from "../../../constants";

const FacilityAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();

  return (
    <>
      <PatientSearchComponent />

      <Grid container spacing={3}>
        <Grid item md={8} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} bgcolor={BLUE_SEVEN} borderRadius={8}>
                <CalendarWhiteIcon />
                <Box p={2} />
                <Typography variant="h3" className="whiteColor">33</Typography>
                <Typography variant="body2" className="whiteColor">{TODAYS_APPOINTMENTS}</Typography>
              </Box>
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} bgcolor={GREEN} borderRadius={8}>
                <ProviderWhiteIcon />
                <Box p={2} />
                <Typography variant="h3" className="whiteColor">30</Typography>
                <Typography variant="body2" className="whiteColor">{ACTIVE_PROVIDERS_IN_CURRENT_SHIFT}</Typography>
              </Box>
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} bgcolor={PURPLE_ONE} borderRadius={8}>
                <StaffWhiteIcon />
                <Box p={2} />
                <Typography variant="h3" className="whiteColor">40</Typography>
                <Typography variant="body2" className="whiteColor">{ACTIVE_STAFF_IN_CURRENT_SHIFT}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box p={2} />

          <Card>
            <Box px={3} pb={2}>
              <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{UPCOMING_APPOINTMENTS}</Typography>

                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Box>

              <AppointmentListComponent />
            </Box>
          </Card>

          <Box p={2} />

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Card>
                <Box px={3} pb={2}>
                  <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h5">{RECENTLY_ADDED_PATIENTS}</Typography>

                    <IconButton>
                      <RedirectIcon />
                    </IconButton>
                  </Box>

                  <Box>
                    {ADDED_PATIENTS_LIST.map((item) => {
                      return (
                        <Box mb={3} display='flex' justifyContent='space-between' alignItems='start'>
                          <Box display='flex'>
                            <Box
                              bgcolor={!item.imageUrl && BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2}
                              display="flex" justifyContent="center" alignItems="center"
                            >
                              {
                                item.imageUrl ? <img src={item.imageUrl} alt={item.shortName} />
                                  : <Typography variant="h6">{item.shortName}</Typography>
                              }
                            </Box>

                            <Box>
                              <Typography variant="body1">{item.fullName}</Typography>

                              <Box color={GRAY_SEVEN}>
                                <Typography variant="body1">DOB: {item.dob}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <MedicalBillingComponent />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item md={8} sm={12} xs={12}>
                  <Box display="flex">
                    <UserOutlinedIcon />

                    <Box ml={2}>
                      <Typography variant="h5">132</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{TOTAL_NUMBER_OF_USERS}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box display="flex" mt={2.5}>
                    <PracticeActiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">70</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{AVAILABLE_USERS_IN_CURRENT_SHIFT}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <PieChart3Component />
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box className={classes.cardContainer}>
              <Grid container justifyContent="center">
                <Grid item md={9} sm={12} xs={12}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item md={4} sm={12} xs={12}>
                      <Link to={`${APPOINTMENTS_ROUTE}/new`}>
                        <Box className={classes.cardBox} onClick={() => history.push(FACILITIES_ROUTE)}>
                          <CalendarBlackIcon />

                          <Box p={0.7} />

                          <Typography variant="h6">{NEW_APPOINTMENT}</Typography>
                        </Box>
                      </Link>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Link to={`${PATIENTS_ROUTE}/new`}>
                        <Box className={classes.cardBox}>

                          <UserBlackIcon />

                          <Box p={0.7} />

                          <Typography variant="h6">{NEW_PATIENT}</Typography>
                        </Box>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Box p={1} />

              <Grid container justifyContent="center">
                <Grid item md={9} sm={12} xs={12}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item md={4} sm={12} xs={12}>
                      <Link to={`${DOCTORS_ROUTE}/new`}>
                        <Box className={classes.cardBox} onClick={() => history.push(PRACTICE_DETAILS_ROUTE)}>
                          <UserBlackIcon />

                          <Box p={0.7} />

                          <Typography variant="h6">{NEW_PROVIDER}</Typography>
                        </Box>
                      </Link>
                    </Grid>

                    <Box p={1} />

                    <Grid item md={4} sm={12} xs={12}>
                      <Link to={`${STAFF_ROUTE}/new`}>
                        <Box className={classes.cardBox} onClick={() => history.push(EMERGENCY_ACCESS_ROUTE)}>
                          <UserBlackIcon />

                          <Box p={0.2} />

                          <Typography variant="h6">{NEW_STAFF}</Typography>
                        </Box>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={4} py={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant="h5">{PATIENT_DISCHARGED}</Typography>

                <Box p={0.5} />

                <Typography variant="body2">{AGAINST_TOTAL_APPOINTMENTS}</Typography>
              </Box>
            </Box>

            <PieChart4Component />

            <Box px={4} pb={2} display='flex' alignItems='center'>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <CalendarBlackIcon />

                    <Box ml={2}>
                      <Typography variant="h5">24</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{TOTAL_APPOINTMENTS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <UserBlackIconTwo />

                    <Box ml={2}>
                      <Typography variant="h5">3</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{TOTAL_DISCHARGED_PATIENTS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
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

export default FacilityAdminDashboardComponent;
