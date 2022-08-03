// packages block
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import ScheduleListing from "../../common/scheduling/Listing";
import PercentagePie from "../../common/charts/PercentagePie";
import PatientSearchComponent from "../../common/Dashboard/patientSearch";
import FacilityDoctorPatients from "../../common/Dashboard/FacilityDoctorPatients";
import UpcomingAppointments from "../../common/Dashboard/DoctorAppointmentsAndPatients";
// svgs, styles, nad constant block
import history from "../../../history";
import Alert from "../../common/Alert";
import { AuthContext } from "../../../context";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { BLUE_SEVEN, GREEN_ONE, WHITE, GREEN, PURPLE_ONE, GREY_NINE } from "../../../theme";
import {
  AppointmentStatus, useFindAllAppointmentListLazyQuery, useFindAllDoctorListLazyQuery,
  useFindAllStaffListLazyQuery
} from "../../../generated/graphql";
import {
  CalendarBlackIcon, CalendarNewIcon, CalendarWhiteIcon, ProviderWhiteIcon, RedirectIcon,
  StaffWhiteIcon, UserBlackIcon, UserBlackIconTwo,
} from "../../../assets/svgs";
import {
  QUICK_ACTIONS, FACILITIES_ROUTE, PATIENTS_ROUTE, VIEW_APPOINTMENTS_ROUTE, ACTIVE_STAFF,
  TODAYS_APPOINTMENTS, ACTIVE_PROVIDERS, NEW_APPOINTMENT, NEW_PROVIDER, SOMETHING_WENT_WRONG,
  TOTAL_APPOINTMENTS, NEW_STAFF, NEW_PATIENT, TOTAL_DISCHARGED_PATIENTS, APPOINTMENTS_ROUTE,
  AGAINST_TOTAL_APPOINTMENTS, PATIENT_DISCHARGED, RECENTLY_ADDED_PATIENTS, STAFF_ROUTE,
  DOCTORS_ROUTE,
} from "../../../constants";

const FacilityDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  const { user } = useContext(AuthContext)
  const { facility } = user || {}

  const { id: facilityId } = facility || {}
  const [appointmentCount, setAppointmentCount] = useState<number>(0)
  const [todayAppointment, setTodayAppointment] = useState<number>(0)

  const [dischargedAppointment, setDischargedAppointment] = useState<number>(0)
  const [providerCount, setProviderCount] = useState<number>(0)
  const [staffCount, setStaffCount] = useState<number>(0)

  const [, setPatientCount] = useState<number>(0)
  // const totalUsers = patientCount + staffCount + providerCount

  const [findAllDoctor] = useFindAllDoctorListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setProviderCount(0)
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { doctors } = findAllDoctor
        setProviderCount(doctors?.length || 0)
      }
    }
  });

  const [findAllStaff] = useFindAllStaffListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setStaffCount(0)
    },

    onCompleted(data) {
      const { findAllStaff } = data || {};

      if (findAllStaff) {
        const { pagination } = findAllStaff

        if (pagination) {
          const { totalCount } = pagination
          setStaffCount(totalCount || 0)
        }
      }
    }
  });

  const [findAllAppointments, { loading: appointmentLoading }] = useFindAllAppointmentListLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  const fetchAllStaff = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: 1 } }
      const staffInputs = { ...pageInputs, facilityId }

      staffInputs && await findAllStaff({
        variables: {
          staffInput: { ...staffInputs, searchString: '' }
        }
      })
    } catch (error) { }
  }, [facilityId, findAllStaff]);

  const fetchAllDoctors = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: 50 } }

      facilityId ? await findAllDoctor({
        variables: {
          doctorInput: {
            doctorFirstName: '', facilityId: facilityId, ...pageInputs
          }
        }
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [facilityId, findAllDoctor])

  const fetchAppointments = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: 1 } }

      if (facilityId) {
        const { data } = await findAllAppointments({
          variables: {
            appointmentInput: {
              ...pageInputs, searchString: '', facilityId
            }
          },
        })

        if (data) {
          const { findAllAppointments } = data || {};

          if (findAllAppointments) {
            const { pagination } = findAllAppointments

            if (pagination) {
              const { totalCount } = pagination

              setAppointmentCount(totalCount || 0)
            }
          }
        }

        const { data: discharged } = await findAllAppointments({
          variables: {
            appointmentInput: {
              ...pageInputs, searchString: '', facilityId, appointmentStatus: 'discharged' as AppointmentStatus
            }
          },
        })

        if (discharged) {
          const { findAllAppointments } = discharged || {};

          if (findAllAppointments) {
            const { pagination } = findAllAppointments

            if (pagination) {
              const { totalCount } = pagination

              setDischargedAppointment(totalCount || 0)
            }
          }
        }
      } else Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [facilityId, findAllAppointments])

  useEffect(() => {
    fetchAllDoctors()
    fetchAllStaff()
    fetchAppointments()
  }, [fetchAllDoctors, fetchAllStaff, fetchAppointments]);

  return (
    <>
      <PatientSearchComponent />

      <Grid container spacing={2}>
        <Grid item md={8} sm={12} xs={12}>
          <Grid container spacing={2} direction="row">
            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} minHeight={180} bgcolor={BLUE_SEVEN} borderRadius={8}>
                <CalendarWhiteIcon />
                <Box p={2} />

                <Typography variant="h3" className="whiteColor">{todayAppointment}</Typography>
                <Typography variant="body2" className="whiteColor">{TODAYS_APPOINTMENTS}</Typography>
              </Box>
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} minHeight={180} bgcolor={GREEN} borderRadius={8}>
                <ProviderWhiteIcon />
                <Box p={2} />
                <Typography variant="h3" className="whiteColor">{providerCount}</Typography>
                <Typography variant="body2" className="whiteColor">{ACTIVE_PROVIDERS}</Typography>
              </Box>
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Box p={3} minHeight={180} bgcolor={PURPLE_ONE} borderRadius={8}>
                <StaffWhiteIcon />
                <Box p={2} />
                <Typography variant="h3" className="whiteColor">{staffCount}</Typography>
                <Typography variant="body2" className="whiteColor">{ACTIVE_STAFF}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box p={1} />

          <Card>
            <Box px={3} pb={2}>
              <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5">{TODAYS_APPOINTMENTS}</Typography>

                <Link to={VIEW_APPOINTMENTS_ROUTE}>
                  <IconButton>
                    <RedirectIcon />
                  </IconButton>
                </Link>
              </Box>

              <UpcomingAppointments setCount={setTodayAppointment} />
            </Box>
          </Card>

          <Box p={1} />

          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Card>
                <Box px={3} pb={2}>
                  <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant="h5">{RECENTLY_ADDED_PATIENTS}</Typography>

                    <Link to={PATIENTS_ROUTE}>
                      <IconButton>
                        <RedirectIcon />
                      </IconButton>
                    </Link>
                  </Box>

                  <FacilityDoctorPatients setPatientCount={setPatientCount} facilityId={facilityId} />
                </Box>
              </Card>
            </Grid>

            {/* <Grid item md={6} sm={12} xs={12}>
              <MedicalBillingComponent />
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box className={classes.cardContainer}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Link to={`${APPOINTMENTS_ROUTE}/new`}>
                  <Box className={classes.cardBox} onClick={() => history.push(FACILITIES_ROUTE)}>
                    <CalendarBlackIcon />

                    <Box p={0.7} />

                    <Typography variant="h6">{NEW_APPOINTMENT}</Typography>
                  </Box>
                </Link>

                <Box p={1} />

                <Link to={`${PATIENTS_ROUTE}/new`}>
                  <Box className={classes.cardBox}>
                    <UserBlackIcon />

                    <Box p={0.7} />

                    <Typography variant="h6">{NEW_PATIENT}</Typography>
                  </Box>
                </Link>
              </Box>

              <Box p={1} />

              <Box display='flex' justifyContent='center' alignItems='center'>
                <Link to={`${DOCTORS_ROUTE}/new`}>
                  <Box className={classes.cardBox}>
                    <UserBlackIcon />

                    <Box p={0.7} />

                    <Typography variant="h6">{NEW_PROVIDER}</Typography>
                  </Box>
                </Link>

                <Box p={1} />

                <Link to={`${STAFF_ROUTE}/new`}>
                  <Box className={classes.cardBox}>
                    <UserBlackIcon />

                    <Box p={0.2} />

                    <Typography variant="h6">{NEW_STAFF}</Typography>
                  </Box>
                </Link>
              </Box>
            </Box>
          </Card>

          {/* <Card>
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item md={8} sm={12} xs={12}>
                  <Box display="flex">
                    <UserOutlinedIcon />

                    <Box ml={2}>
                      <Typography variant="h5">{totalUsers}</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{TOTAL_NUMBER_OF_USERS}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box display="flex" mt={2.5}>
                    <PracticeActiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">{totalUsers - 1}</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{AVAILABLE_USERS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  {!staffLoading &&
                    <PercentagePie
                      completed={1}
                      total={totalUsers - 1}
                      className='chartContainerSmall'
                    />
                  }
                </Grid>
              </Grid>
            </Box>
          </Card> */}

          <Box p={1} />

          <Card>
            <Box px={3} py={2}>
              <Typography variant="h5">{PATIENT_DISCHARGED}</Typography>

              <Box p={0.5} />

              <Typography variant="body2">{AGAINST_TOTAL_APPOINTMENTS}</Typography>
            </Box>

            {!appointmentLoading &&
              <PercentagePie
                showText
                total={appointmentCount}
                className='chartContainer'
                completed={dischargedAppointment}
              />
            }

            <Box px={4} pb={2} display='flex' alignItems='center'>
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex' alignItems='center' flexWrap='wrap'>
                    <Box
                      bgcolor={GREY_NINE} borderRadius={4} width={45} height={45} p={1} mr={2}
                      display="flex" justifyContent="center" alignItems="center"
                    >
                      <CalendarNewIcon />
                    </Box>

                    <Box>
                      <Typography variant="h5">{appointmentCount}</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{TOTAL_APPOINTMENTS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex' alignItems='center' flexWrap='wrap'>
                    <Box
                      bgcolor={GREY_NINE} borderRadius={4} width={45} height={45} p={1} mr={2}
                      display="flex" justifyContent="center" alignItems="center"
                    >
                      <UserBlackIconTwo />
                    </Box>

                    <Box>
                      <Typography variant="h5">{dischargedAppointment}</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{TOTAL_DISCHARGED_PATIENTS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={1} />

          <ScheduleListing />
        </Grid>
      </Grid>
    </>
  )
};

export default FacilityDashboardComponent;
