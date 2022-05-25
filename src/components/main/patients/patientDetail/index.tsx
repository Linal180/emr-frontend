// packages block
import { ChangeEvent, Reducer, useReducer, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Box, Button, Tab } from "@material-ui/core";
// import { SubmitHandler, useForm } from "react-hook-form";
import { Pagination, TabContext, TabList, TabPanel } from "@material-ui/lab";
//components block
import Insurance from './Insurance';
// import Selector from "../../../common/Selector";
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
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { AppointmentsPayload, Appointmentstatus, AttachmentsPayload, PatientPayload, useFindAllAppointmentsLazyQuery } from '../../../../generated/graphql';
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
} from "../../../../constants";
import { getFormattedDate } from '../../../../utils';

const PatientDetailsComponent = (): JSX.Element => {
  // const widgetId = "widget-menu";
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

            totalPages && appointmentDispatch({ type: appointmentActionType.SET_TOTAL_PAGES_COMING, totalPagesComing: totalPages })
          }

          appointmentDispatch({
            type: appointmentActionType.SET_UP_COMING,
            upComing: appointments?.filter(appointment => new Date(getFormattedDate(appointment?.scheduleStartDateTime || '')) > new Date()) as AppointmentsPayload['appointments']
          });

          appointmentDispatch({
            type: appointmentActionType.SET_COMPLETED,
            completed: appointments?.filter(appointment => new Date(getFormattedDate(appointment?.scheduleStartDateTime || '')) < new Date()) as AppointmentsPayload['appointments']
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

          <TabPanel value="1">
            <Box display="flex">
              <AreaChartComponent data={areaChartOne} />
              <AreaChartComponent data={areaChartTwo} />
              <BarChart2Component year={{ id: '2022', name: '2022' }} />
            </Box>

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

            <Box display="flex">
              <CareTeamComponent />
              <Box width="50%" mt={3}>

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
              </Box>
            </Box>

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
