// packages block
import { ChangeEvent, Reducer, useReducer, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Box, Button, Tab, Typography, Grid, Card } from "@material-ui/core";
import { Pagination, TabContext, TabList, TabPanel } from "@material-ui/lab";
//components block
import Insurance from './Insurance';
import AreaChartComponent from './charts';
import CareTeamComponent from './careTeam';
import PortalTable from '../../../common/patient/portal';
import CardComponent from '../../../common/CardComponent';
import AppointmentList from '../../../common/AppointmentList';
import DocumentsTable from '../../../common/patient/documents';
import LabOrdersTable from '../../../common/patient/labOrders';
import ConfirmationModal from "../../../common/ConfirmationModal";
import BarChart2Component from '../../../common/charts/PracticesByYear';
import PatientProfileHero from '../../../common/patient/profileHero';
import EnounterComponent from '../../patients/patientDetail/encounters';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import {
  AppointmentsPayload, Appointmentstatus, AttachmentsPayload, PatientPayload, useFindAllAppointmentsLazyQuery
} from '../../../../generated/graphql';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import {
  appointmentReducer, Action as appointmentAction, initialState as appointmentInitialState, State as appointmentState,
  ActionType as appointmentActionType
} from "../../../../reducers/appointmentReducer";
import {
  DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, VIEW_CHART_TEXT, CHART_ROUTE, PATIENTS_ROUTE,
  PROFILE_TOP_TABS, UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS, areaChartOne, areaChartTwo, PAGE_LIMIT,
  BLOOD_PRESSURE_TEXT, HEART_RATE_TEXT, BLOOD_PRESSURE_LAST_READ, LAST_READING_TEXT, BLOOD_PRESSURE_UNIT,
  HEART_RATE_UNIT, HEART_RATE_LAST_READ, BLOOD_PRESSURE_RANGES, Heart_RATE_RANGES, BLOOD_PRESSURE_VALUE, HEART_RATE_VALUE,
} from "../../../../constants";
import { getFormattedDate } from '../../../../utils';
import { BloodPressureIcon, HeartRateIcon } from '../../../../assets/svgs';

const PatientDetailsComponent = (): JSX.Element => {
  const { id, tabValue: routeParamValue } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [{ openDelete, tabValue, patientData }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [{
    pageComing, pageCompleted, totalPagesComing, totalPagesCompleted, upComing, completed
  }, appointmentDispatch] = useReducer<Reducer<appointmentState, appointmentAction>>(appointmentReducer, appointmentInitialState)

  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const handleDeleteWidget = () => { };

  useEffect(() => {
    if (routeParamValue) {
      dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: routeParamValue })
    }
  }, [routeParamValue])

  const [findUpComingAppointments, { loading: upComingLoading, error: upComingError }] =
    useFindAllAppointmentsLazyQuery({
      fetchPolicy: "network-only",
      nextFetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,

      onError({ message }) {
        appointmentDispatch({ type: appointmentActionType.SET_UP_COMING, upComing: [] });
      },

      onCompleted(data) {
        const { findAllAppointments } = data || {};

        if (findAllAppointments) {
          const { appointments, pagination } = findAllAppointments

          if (pagination) {
            const { totalPages } = pagination

            totalPages && appointmentDispatch({
              type: appointmentActionType.SET_TOTAL_PAGES_COMING, totalPagesComing: totalPages
            })
          }

          appointmentDispatch({
            type: appointmentActionType.SET_UP_COMING,
            upComing: appointments?.filter(appointment =>
              new Date(getFormattedDate(appointment?.scheduleStartDateTime || '')) >
              new Date()) as AppointmentsPayload['appointments']
          });

          appointmentDispatch({
            type: appointmentActionType.SET_COMPLETED,
            completed: appointments?.filter(appointment =>
              new Date(getFormattedDate(appointment?.scheduleStartDateTime || '')) <
              new Date()) as AppointmentsPayload['appointments']
          });
        }
      }
    });

  const fetchComing = useCallback(async () => {
    try {
      id && await findUpComingAppointments({
        variables: {
          appointmentInput: {
            patientId: id,
            appointmentStatus: Appointmentstatus.Initiated.toLocaleLowerCase(),
            paginationOptions: {
              limit: PAGE_LIMIT, page: pageComing
            },
          }
        }
      })
    } catch (error) { }
  }, [findUpComingAppointments, pageComing, id])

  const handleComingChange = (_: ChangeEvent<unknown>, value: number) => appointmentDispatch({
    type: appointmentActionType.SET_PAGE_COMING, pageComing: value
  });

  const handleCompletedChange = (_: ChangeEvent<unknown>, value: number) => appointmentDispatch({
    type: appointmentActionType.SET_PAGE_COMPLETED, pageCompleted: value
  });

  useEffect(() => {
    if (id) {
      fetchComing();
    }
  }, [fetchComing, id]);

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box display="flex" flexWrap="wrap">
            <TabList onChange={handleChange} aria-label="Profile top tabs">
              {PROFILE_TOP_TABS.map(item => (
                <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
              ))}
            </TabList>
          </Box>

          <Box pr={2}>
            <Link to={`${PATIENTS_ROUTE}/${id}${CHART_ROUTE}`}>
              <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
            </Link>
          </Box>
        </Box>

        <Box className={classes.profileDetailsContainer}>
          <PatientProfileHero
            setPatient={(patient: PatientPayload['patient']) =>
              dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient })
            }
            setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
              mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
            }
          />

          <Box p={1} />

          <TabPanel value="1">
            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <Box width="100%" className='card-chart'>
                  <Box display="flex" justifyContent="space-between" p={3} >
                    <BloodPressureIcon />
                    <Box>
                      <Typography variant="h2" align='right'>{BLOOD_PRESSURE_TEXT}</Typography>
                      <Typography component="span" align='right'>
                        {LAST_READING_TEXT}: {BLOOD_PRESSURE_LAST_READ}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className='bloodPressure-measurement'>
                    <Typography variant="h2">{BLOOD_PRESSURE_VALUE}
                      <span className='measure-unit'>{BLOOD_PRESSURE_UNIT}</span>
                    </Typography>

                    <Typography className='measure-frequency primary' component="span">
                      {BLOOD_PRESSURE_RANGES.Normal}
                    </Typography>
                  </Box>

                  <Box className='areaBloodPressureChart'>
                    <AreaChartComponent data={areaChartOne} />
                  </Box>
                </Box>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <Box width="100%" className='card-chart'>
                  <Box display="flex" justifyContent="space-between" p={3}>
                    <HeartRateIcon />

                    <Box>
                      <Typography variant="h2" align='right'>{HEART_RATE_TEXT}</Typography>

                      <Typography component="span" align='right'>{LAST_READING_TEXT}: {HEART_RATE_LAST_READ}</Typography>
                    </Box>
                  </Box>

                  <Box className='heartRate-measurement'>
                    <Typography variant="h2">{HEART_RATE_VALUE}
                      <span className='measure-unit'>{HEART_RATE_UNIT}</span>
                    </Typography>

                    <Typography className='measure-frequency danger' component="span">{Heart_RATE_RANGES.Abnormal}</Typography>
                  </Box>

                  <Box className='areaBloodPressureChart'>
                    <AreaChartComponent data={areaChartTwo} />
                  </Box>
                </Box>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Card>
                  <BarChart2Component year={{ id: '2022', name: '2022' }} />
                </Card>
              </Grid>
            </Grid>

            <Box p={2} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6}>
                <CardComponent cardTitle={UPCOMING_APPOINTMENTS}>
                  <AppointmentList appointments={upComing} type={Appointmentstatus.Initiated} />

                  {((!upComingLoading && upComing?.length === 0) || upComingError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataFoundComponent />
                    </Box>
                  )}

                  {totalPagesComing > 1 &&
                    <Box my={2} display="flex" justifyContent="flex-end">
                      <Pagination
                        count={totalPagesComing}
                        shape="rounded"
                        variant="outlined"
                        page={pageCompleted}
                        onChange={handleComingChange}
                      />
                    </Box>
                  }
                </CardComponent>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <EnounterComponent />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6}>
                <CareTeamComponent />
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <CardComponent cardTitle={PAST_APPOINTMENTS}>
                  <AppointmentList appointments={completed} type={Appointmentstatus.Completed} />

                  {((!upComingLoading && completed?.length === 0) || upComingError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataFoundComponent />
                    </Box>
                  )}

                  {totalPagesCompleted > 1 &&
                    <Box my={2} display="flex" justifyContent="flex-end">
                      <Pagination
                        count={totalPagesCompleted}
                        shape="rounded"
                        variant="outlined"
                        page={pageCompleted}
                        onChange={handleCompletedChange}
                      />
                    </Box>
                  }
                </CardComponent>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
            <DocumentsTable />
          </TabPanel>

          <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(patientData?.inviteAccepted)} />
          </TabPanel>

          <TabPanel value="10">
            <LabOrdersTable />
          </TabPanel>
        </Box>
      </TabContext>

      <ConfirmationModal
        title={DELETE_WIDGET_TEXT}
        isOpen={openDelete}
        description={DELETE_WIDGET_DESCRIPTION}
        handleDelete={handleDeleteWidget}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
    </Box>
  )
}

export default PatientDetailsComponent;
