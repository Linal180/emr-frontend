// packages block
import { Box, Button, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { ChangeEvent, Reducer, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
//components block
import CardComponent from '../../../common/CardComponent';
import SideDrawer from '../../../common/SideDrawer';
import CareTeamComponent from './careTeam';
import CareTeamProvider from './careTeam/sideDrawer';
import Insurance from './insurance';
import PortalAccessCard from './portalAccessCard';
// import PortalTable from '../../../common/patient/portal';
import AppointmentList from '../../../common/AppointmentList';
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataComponent from '../../../common/NoDataComponent';
import DocumentsTable from '../../../common/patient/documents';
import LabOrdersTable from '../../../common/patient/labOrders';
import PatientProfileHero from '../../../common/patient/profileHero';
import EncounterList from '../../patients/patientDetail/encounters';
import VitalCard from './vitalCard';
// import PracticesByYear from '../../../common/charts/PracticesByYear';
// constants, history, styling block
import {
  CHART_ROUTE, DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, LIST_PAGE_LIMIT, PAST_APPOINTMENTS, PATIENTS_ROUTE,
  PROFILE_TOP_TABS, UPCOMING_APPOINTMENTS, VIEW_CHART_TEXT
} from "../../../../constants";
import {
  AppointmentsPayload, AppointmentStatus, AttachmentsPayload, PatientPayload,
  PatientProviderPayload, useFindAllAppointmentsLazyQuery, useFindAllUpcomingAppointmentsLazyQuery, useGetPatientProvidersLazyQuery
} from '../../../../generated/graphql';
import { ParamsType } from "../../../../interfacesTypes";
import {
  Action as appointmentAction, ActionType as appointmentActionType, appointmentReducer, initialState as appointmentInitialState, State as appointmentState
} from "../../../../reducers/appointmentReducer";
import { Action as mediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer, State as mediaState } from "../../../../reducers/mediaReducer";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { hasEncounter } from '../../../../utils';
// import { WHITE } from '../../../../theme';

const PatientDetailsComponent = (): JSX.Element => {
  const { id, tabValue: routeParamValue } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [{
    openDelete, tabValue, patientData, patientProvidersData, doctorPatientId, doctorId, isEdit, doctorName
  }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const [{ pageComing, upComing, completed, encounters }, appointmentDispatch] =
    useReducer<Reducer<appointmentState, appointmentAction>>(appointmentReducer, appointmentInitialState)

  const [{ drawerOpened }, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const handleDeleteWidget = () => { };
  const toggleSideDrawer = () => { mediaDispatcher({ type: mediaActionType.SET_DRAWER_OPENED, drawerOpened: !drawerOpened }) }

  useEffect(() => {
    routeParamValue &&
      dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: routeParamValue })
  }, [routeParamValue])

  const [findUpComingAppointments, { loading: upComingLoading, error: upComingError }] =
    useFindAllUpcomingAppointmentsLazyQuery({
      fetchPolicy: "network-only",
      nextFetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,

      onError() {
        appointmentDispatch({ type: appointmentActionType.SET_UP_COMING, upComing: [] });
      },

      onCompleted(data) {
        const { findAllUpcomingAppointments } = data || {};

        if (findAllUpcomingAppointments) {
          const { appointments } = findAllUpcomingAppointments

          appointmentDispatch({
            type: appointmentActionType.SET_UP_COMING,
            upComing: appointments?.filter((appointment) => appointment?.status && ![AppointmentStatus.Cancelled, AppointmentStatus.Discharged].includes(appointment?.status)) as AppointmentsPayload['appointments']
          });
        }
      }
    });

  const [findPastAppointments, { loading: pastLoading, error: pastError }] =
    useFindAllUpcomingAppointmentsLazyQuery({
      fetchPolicy: "network-only",
      nextFetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,

      onError() {
        appointmentDispatch({ type: appointmentActionType.SET_COMPLETED, completed: [] });
      },

      onCompleted(data) {
        const { findAllUpcomingAppointments } = data || {};

        if (findAllUpcomingAppointments) {
          const { appointments } = findAllUpcomingAppointments

          appointmentDispatch({
            type: appointmentActionType.SET_COMPLETED,
            completed: appointments as AppointmentsPayload['appointments']
          });
        }
      }
    });

  const [findEncounters] =
    useFindAllAppointmentsLazyQuery({
      fetchPolicy: "network-only",
      nextFetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,

      onError() {
        appointmentDispatch({ type: appointmentActionType.SET_ENCOUNTERS, encounters: [] });
      },

      onCompleted(data) {
        const { findAllAppointments } = data || {};

        if (findAllAppointments) {
          const { appointments } = findAllAppointments

          appointmentDispatch({
            type: appointmentActionType.SET_ENCOUNTERS, encounters: appointments?.filter((appointment) => appointment?.status && hasEncounter(appointment?.status)) as AppointmentsPayload['appointments']
          })
        }
      }
    });

  const fetchComing = useCallback(async () => {
    try {
      id && await findUpComingAppointments({
        variables: {
          upComingAppointmentsInput: {
            patientId: id,
            shouldFetchPast: false,
            paginationOptions: {
              limit: LIST_PAGE_LIMIT, page: pageComing
            },
          }
        }
      })
    } catch (error) { }
  }, [findUpComingAppointments, pageComing, id])

  const fetchPast = useCallback(async () => {
    try {
      id && await findPastAppointments({
        variables: {
          upComingAppointmentsInput: {
            patientId: id,
            shouldFetchPast: true,
            paginationOptions: {
              limit: LIST_PAGE_LIMIT, page: pageComing
            },
          }
        }
      })
    } catch (error) { }
  }, [id, findPastAppointments, pageComing])

  const fetchEncounters = useCallback(async () => {
    try {
      id && await findEncounters({
        variables: {
          appointmentInput: {
            patientId: id,
            paginationOptions: {
              limit: LIST_PAGE_LIMIT, page: pageComing
            },
          }
        }
      })
    } catch (error) { }
  }, [id, findEncounters, pageComing])

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
          dispatch({
            type: ActionType.SET_PATIENT_PROVIDERS_DATA,
            patientProvidersData: providers as PatientProviderPayload['providers']
          })
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
      fetchPast();
      fetchEncounters();
    }
  }, [fetchComing, fetchEncounters, fetchPast, id]);

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" maxWidth="100%">
          <TabList onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            aria-label="Profile top tabs">
            {PROFILE_TOP_TABS.map(item => (
              <Tab
                classes={{ wrapper: classes.tab }} key={`${item.title}-${item.value}`} label={item.title} value={item.value}
              />
            ))}
          </TabList>

          <Link to={`${PATIENTS_ROUTE}/${id}${CHART_ROUTE}`}>
            <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
          </Link>
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

          <TabPanel value="1">

            <PortalAccessCard inviteAccepted={Boolean(patientData?.inviteAccepted)} />

            <Box mb={2} pb={4} className='masonry-container'>
              <VitalCard />

              <Box className='masonry-box'>
                <CardComponent cardTitle={UPCOMING_APPOINTMENTS}>
                  <Box pb={3}>
                    <AppointmentList appointments={upComing} type={AppointmentStatus.Scheduled} />
                  </Box>

                  {((!upComingLoading && upComing?.length === 0) || upComingError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataComponent />
                    </Box>
                  )}
                </CardComponent>
              </Box>

              <Box className='masonry-box'>
                <CardComponent cardTitle={PAST_APPOINTMENTS}>
                  <Box pb={3}>
                    <AppointmentList appointments={completed} type={AppointmentStatus.Discharged} />
                  </Box>

                  {((!pastLoading && completed?.length === 0) || pastError) && (
                    <Box display="flex" justifyContent="center" pb={12} pt={5}>
                      <NoDataComponent />
                    </Box>
                  )}
                </CardComponent>
              </Box>

              {/* <Box className='masonry-box'>
                <Card>
                  <Box px={3} pt={3} color="#21E1D8" bgcolor={WHITE} paddingBottom={3}>
                    <Typography variant="h4">{VISITS}</Typography>
                  </Box>

                  {/* Implement patient visits by year */}
              {/* <PracticesByYear year={{ id: '2022', name: '2022' }} />
                </Card>
              </Box>  */}
              <Box className='masonry-box'>
                <CareTeamComponent
                  patientProvidersData={patientProvidersData}
                />
              </Box>

              <Box className='masonry-box'>
                <EncounterList appointments={encounters} />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
            <DocumentsTable patient={patientData} />
          </TabPanel>

          {/* <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(patientData?.inviteAccepted)} />
          </TabPanel> */}

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
              providerBtn={true}
              isEditable={true}
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
