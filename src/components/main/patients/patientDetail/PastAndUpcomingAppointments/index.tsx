// packages block
import { Box, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import dotenv from 'dotenv';
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";

// components block
import CardComponent from "../../../../common/CardComponent";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import Search from "../../../../common/Search";
import PastAndUpcomingAppointmentList from "./PastAndUpcomingAppointmentList";
// graphql, constants, context, interfaces/types, reducer and utils block
import { Pagination } from "@material-ui/lab";
import { useParams } from "react-router";
import { AppointmentSearchingTooltipData, APPOINTMENT_TABS, PAGE_LIMIT, PAST_APPOINTMENTS, UPCOMING_APPOINTMENTS } from "../../../../../constants";
import {
  AppointmentsPayload, useFindAllUpcomingAppointmentsLazyQuery
} from "../../../../../generated/graphql";
import { ParamsType } from "../../../../../interfacesTypes";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../../../../reducers/appointmentReducer";
import { useTableStyles } from "../../../../../styles/tableStyles";

dotenv.config()

const PastAndUpcomingAppointments: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { id: patientId } = useParams<ParamsType>()
  const { tabValue: routeParamValue } = useParams<ParamsType>();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { pageComing, upComing, completed, pageCompleted, totalPagesComing,
    totalPagesCompleted, searchComingQuery, searchPastQuery, tabValue } = state

  const [fetchAppointments, { loading: upcomingAppointmentsLoading, error: upcomingAppointmentsError }] = useFindAllUpcomingAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_COMPLETED, completed: [] });
    },

    onCompleted(data) {
      const { findAllUpcomingAppointments } = data || {};
      if (findAllUpcomingAppointments) {
        const { appointments, pagination } = findAllUpcomingAppointments

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES_COMING, totalPagesComing: totalPages })
        }

        !!appointments && dispatch({
          type: ActionType.SET_UP_COMING,
          upComing: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const [fetchPastAppointments, { loading: fetchPastAppointmentsLoading, error: fetchPastAppointmentsError }] = useFindAllUpcomingAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_COMPLETED, completed: [] });
    },

    onCompleted(data) {
      const { findAllUpcomingAppointments } = data || {};
      if (findAllUpcomingAppointments) {
        const { appointments, pagination } = findAllUpcomingAppointments

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES_COMPLETED, totalPagesCompleted: totalPages })
        }

        !!appointments && !!completed && dispatch({
          type: ActionType.SET_COMPLETED,
          completed: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const fetchComing = useCallback(async () => {
    try {
      patientId && await fetchAppointments({
        variables: {
          upComingAppointmentsInput: {
            patientId: patientId,
            shouldFetchPast: false,
            searchString: searchComingQuery,
            paginationOptions: {
              limit: PAGE_LIMIT, page: pageComing
            },
          }
        }
      })
    } catch (error) { }
  }, [patientId, fetchAppointments, searchComingQuery, pageComing])

  const fetchPast = useCallback(async () => {
    try {
      patientId && await fetchPastAppointments({
        variables: {
          upComingAppointmentsInput: {
            patientId: patientId,
            shouldFetchPast: true,
            searchString: searchPastQuery,
            paginationOptions: {
              limit: PAGE_LIMIT, page: pageCompleted,
            },
          }
        }
      })
    } catch (error) { }
  }, [patientId, fetchPastAppointments, searchPastQuery, pageCompleted])

  useEffect(() => {
    fetchComing();
    fetchPast();
  }, [fetchComing, fetchPast]);


  const searchUpcoming = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_COMING_QUERY, searchComingQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES_COMING, totalPagesComing: 0 })
    dispatch({ type: ActionType.SET_PAGE_COMING, pageComing: 1 })
  }

  const searchPast = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_PAST_QUERY, searchPastQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES_COMPLETED, totalPagesCompleted: 0 })
    dispatch({ type: ActionType.SET_PAGE_COMPLETED, pageCompleted: 1 })
  }

  const handleComingChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE_COMING, pageComing: value
  });

  const handlePastChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE_COMPLETED, pageCompleted: value
  });

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  useEffect(() => {
    routeParamValue &&
      dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: routeParamValue })
  }, [routeParamValue])

  return (
    <Box className={classes.tabWrapper} pt={2}>
      <TabContext value={tabValue}>
        <TabList onChange={handleChange}
          variant="scrollable"
          aria-label="Profile top tabs">
          {APPOINTMENT_TABS.map(item => (
            <Tab
              classes={{ wrapper: classes.tab }} key={`${item.title}-${item.value}`} label={item.title} value={item.value}
            />
          ))}
        </TabList>

        <TabPanel value="1">
          <Box mb={2} maxWidth={450}>
            <Search info search={searchUpcoming} tooltipData={AppointmentSearchingTooltipData} />
          </Box>

          <Box maxHeight={`calc(100vh - 320px)`} overflow='auto'>
            <CardComponent cardTitle={UPCOMING_APPOINTMENTS}>
              <PastAndUpcomingAppointmentList appointments={upComing} reload={() => fetchComing()} />

              {((!upcomingAppointmentsLoading && upComing?.length === 0) || upcomingAppointmentsError) && (
                <Box display="flex" justifyContent="center" pb={12} pt={5}>
                  <NoDataFoundComponent />
                </Box>
              )}
            </CardComponent>

            {
              totalPagesComing > 1 &&
              <Box display="flex" justifyContent="flex-end" pt={3}>
                <Pagination
                  shape="rounded"
                  variant="outlined"
                  page={pageComing}
                  count={totalPagesComing}
                  onChange={handleComingChange}
                />
              </Box>
            }

          </Box>
        </TabPanel>

        <TabPanel value="2">
          <Box maxHeight={`calc(100vh - 320px)`} overflow='auto'>
            <Box mb={2} maxWidth={450}>
              <Search search={searchPast} info tooltipData={AppointmentSearchingTooltipData} />
            </Box>

            <CardComponent cardTitle={PAST_APPOINTMENTS}>
              <PastAndUpcomingAppointmentList appointments={completed} past reload={() => fetchPast()} />

              {((!fetchPastAppointmentsLoading && completed?.length === 0) || fetchPastAppointmentsError) && (
                <Box display="flex" justifyContent="center" pb={12} pt={5}>
                  <NoDataFoundComponent />
                </Box>
              )}
            </CardComponent>

            {totalPagesCompleted > 1 &&
              <Box display="flex" justifyContent="flex-end" pt={3}>
                <Pagination
                  shape="rounded"
                  variant="outlined"
                  page={pageCompleted}
                  count={totalPagesCompleted}
                  onChange={handlePastChange}
                />
              </Box>
            }
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default PastAndUpcomingAppointments;
