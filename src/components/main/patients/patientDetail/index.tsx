// packages block
import { ChangeEvent, Reducer, useReducer, useEffect, useCallback, useState } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Box, Button, Tab, Typography, Grid, Card } from "@material-ui/core";
import { Pagination, TabContext, TabList, TabPanel } from "@material-ui/lab";
//components block
import Insurance from './insurance';
import AreaChartComponent from './charts';
import CareTeamComponent from './careTeam';
import CareTeamProvider from './careTeam/sideDrawer';
import PortalTable from '../../../common/patient/portal';
import CardComponent from '../../../common/CardComponent';
import AppointmentList from '../../../common/AppointmentList';
import DocumentsTable from '../../../common/patient/documents';
import LabOrdersTable from '../../../common/patient/labOrders';
import ConfirmationModal from "../../../common/ConfirmationModal";
import EncounterList from '../../patients/patientDetail/encounters';
import PatientProfileHero from '../../../common/patient/profileHero';
import PracticesByYear from '../../../common/charts/PracticesByYear';
import NoDataComponent from '../../../common/NoDataComponent';
// constants, history, styling block
import { WHITE } from '../../../../theme';
import history from "../../../../history";
import { getFormattedDate } from '../../../../utils';
import { ParamsType } from "../../../../interfacesTypes";
import { BloodPressureIcon, HeartRateIcon } from '../../../../assets/svgs';
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  AppointmentsPayload, AppointmentStatus, AttachmentsPayload, PatientPayload, PatientProviderPayload,
  useFindAllAppointmentsLazyQuery, useGetPatientProvidersLazyQuery
} from '../../../../generated/graphql';
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
  HEART_RATE_UNIT, HEART_RATE_LAST_READ, BLOOD_PRESSURE_RANGES, Heart_RATE_RANGES, BLOOD_PRESSURE_VALUE,
  HEART_RATE_VALUE, VISITS, EDIT_PATIENT,
} from "../../../../constants";
import SideDrawer from '../../../common/SideDrawer';


const PatientDetailsComponent = (): JSX.Element => {
  const { id, tabValue: routeParamValue } = useParams<ParamsType>();
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const classes = useProfileDetailsStyles();
  const [{ openDelete, tabValue, patientData, patientProvidersData, doctorPatientId, doctorId, isEdit, doctorName }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [state, appointmentDispatch] =
    useReducer<Reducer<appointmentState, appointmentAction>>(appointmentReducer, appointmentInitialState)
  const {
    pageComing, pageCompleted, totalPagesComing, totalPagesCompleted, upComing, completed
  } = state
  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const handleDeleteWidget = () => { };

  const toggleSideDrawer = () => { setDrawerOpened(!drawerOpened) }

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

      onError() {
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
            appointmentStatus: AppointmentStatus.Initiated.toLocaleLowerCase(),
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

  const handleProviderEdit = (id: string, providerId: string) => {
    dispatch({ type: ActionType.SET_DOCTOR_PATIENT_ID, doctorPatientId: id })
    dispatch({ type: ActionType.SET_DOCTOR_ID, doctorId: providerId })
  }

  const [getPatientProviders, { loading: getPatientLoading }] = useGetPatientProvidersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() { },

    onCompleted(data) {
      if (data) {
        const { getPatientProviders } = data;

        if (getPatientProviders) {

          const { providers } = getPatientProviders;
          dispatch({ type: ActionType.SET_PATIENT_PROVIDERS_DATA, patientProvidersData: providers as PatientProviderPayload['providers'] })
        }
      }
    },
  });

  const fetchAllPatientsProviders = useCallback(async () => {
    try {
      id && await getPatientProviders({
        variables: {
          getPatient: { id }
        }
      })
    } catch (error) { }
  }, [id, getPatientProviders])

  useEffect(() => {
    fetchAllPatientsProviders()
  }, [fetchAllPatientsProviders]);

  useEffect(() => {
    if (id) {
      fetchComing();
    }
  }, [fetchComing, id]);

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" flexWrap="wrap" maxWidth="100%">
          <TabList onChange={handleChange}
            variant="scrollable"
            aria-label="Profile top tabs">
            {PROFILE_TOP_TABS.map(item => (
              <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
            ))}
          </TabList>
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

          <Box pt={1.5} pb={1.5} />

          <Box display="flex" alignItems="center">
            <Button color="secondary" variant="outlined" onClick={() => history.push(`${PATIENTS_ROUTE}/${id}`)}>
              {EDIT_PATIENT}
            </Button>

            <Box p={1} />

            <Link to={`${PATIENTS_ROUTE}/${id}${CHART_ROUTE}`}>
              <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
            </Link>
          </Box>

          <TabPanel value="1">
            <Box mb={2} pb={4} className='masonry-container'>
              <Box className='masonry-box'>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
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

                      <Box className='areaBloodPressureChart areaChartContainer'>
                        <AreaChartComponent data={areaChartOne} />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12} sm={12}>
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

                        <Typography className='measure-frequency danger-bg' component="span">{Heart_RATE_RANGES.Abnormal}</Typography>
                      </Box>

                      <Box className='areaBloodPressureChart areaChartContainer'>
                        <AreaChartComponent data={areaChartTwo} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box className='masonry-box'>
                <CardComponent cardTitle={UPCOMING_APPOINTMENTS}>
                  <AppointmentList appointments={upComing} type={AppointmentStatus.Initiated} />

                  {((!upComingLoading && upComing?.length === 0) || upComingError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataComponent />
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
              </Box>

              <Box className='masonry-box'>
                <CardComponent cardTitle={PAST_APPOINTMENTS}>
                  <AppointmentList appointments={completed} type={AppointmentStatus.Discharged} />

                  {((!upComingLoading && completed?.length === 0) || upComingError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataComponent />
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
              </Box>

              <Box className='masonry-box'>
                <Card>
                  <Box px={3} pt={3} color="#21E1D8" bgcolor={WHITE} paddingBottom={3}>
                    <Typography variant="h4">{VISITS}</Typography>
                  </Box>

                  {/* Implement patient visits by year */}
                  <PracticesByYear year={{ id: '2022', name: '2022' }} />
                </Card>
              </Box>

              <Box className='masonry-box'>
                <EncounterList />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
            <DocumentsTable patient={patientData} />
          </TabPanel>

          <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(patientData?.inviteAccepted)} />
          </TabPanel>

          <TabPanel value="10">
            <LabOrdersTable />
          </TabPanel>

          <TabPanel value="11">
            <CareTeamComponent
              onEdit={(id: string, providerId: string) => handleProviderEdit(id, providerId)}
              toggleSideDrawer={toggleSideDrawer}
              patientId={id}
              loading={getPatientLoading}
              reload={() => fetchAllPatientsProviders()}
              patientProvidersData={patientProvidersData}
              drawerOpened={drawerOpened}
              patientDispatcher={dispatch}
            />
          </TabPanel>
        </Box>
      </TabContext>

      <Box className="careTeam-side-drawer">
        <SideDrawer
          drawerOpened={drawerOpened}
          toggleSideDrawer={toggleSideDrawer} >
          <CareTeamProvider
            toggleSideDrawer={toggleSideDrawer}
            patientId={id}
            reload={() => fetchAllPatientsProviders()}
            doctorId={doctorId}
            doctorPatientId={doctorPatientId}
            isEdit={isEdit}
            doctorName={doctorName}
            patientProvidersData={patientProvidersData}
          />
        </SideDrawer>
      </Box>

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
