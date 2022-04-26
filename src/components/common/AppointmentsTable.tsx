// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import dotenv from 'dotenv';
import moment from "moment";
import { Link } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "./Alert";
import Search from "./Search";
import TableLoader from "./TableLoader";
import ConfirmationModal from "./ConfirmationModal";
import NoDataFoundComponent from "./NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext } from "../../context";
import { EditNewIcon, TrashNewIcon, } from "../../assets/svgs"
import { useTableStyles } from "../../styles/tableStyles";
import { AppointmentsTableProps } from "../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../reducers/appointmentReducer";
import {
  getFormattedDate, renderTh, getISOTime, appointmentStatus, getStandardTime, isSuperAdmin,
  isFacilityAdmin, isPracticeAdmin
} from "../../utils";
import {
  AppointmentPayload, AppointmentsPayload, useFindAllAppointmentsLazyQuery, useRemoveAppointmentMutation,
  useGetAppointmentsLazyQuery
} from "../../generated/graphql";
import {
  ACTION, DOCTOR, PATIENT, DATE, FACILITY, PAGE_LIMIT, CANT_CANCELLED_APPOINTMENT, STATUS, APPOINTMENT,
  TYPE, APPOINTMENTS_ROUTE, DELETE_APPOINTMENT_DESCRIPTION, CANCEL_TIME_EXPIRED_MESSAGE, TIME,
} from "../../constants";

dotenv.config()

const AppointmentsTable: FC<AppointmentsTableProps> = ({ doctorId }): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, totalPages, deleteAppointmentId, openDelete, searchQuery, appointments } = state;

  const [findAllAppointments, { loading, error }] = useFindAllAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { appointments, pagination } = findAllAppointments

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }

        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const [getAppointments, {
    loading: getAppointmentsLoading, error: doctorAppointmentError
  }] = useGetAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
    },

    onCompleted(data) {
      const { getAppointments } = data || {};

      if (getAppointments) {
        const { appointments, pagination } = getAppointments

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }

        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const [removeAppointment, { loading: deleteAppointmentLoading }] = useRemoveAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      if (data) {
        const { removeAppointment: { response } } = data

        if (response) {
          const { message } = response

          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          try {
            await fetchAppointments()
          } catch (error) { }
        }
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    try {
      if (doctorId) {
        await getAppointments({
          variables: { getAppointments: { doctorId } }
        })
      }
      else {
        const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
        const inputs = isSuper ? { ...pageInputs } :
          isPracAdmin ? { practiceId, ...pageInputs } :
            isFacAdmin ? { facilityId, ...pageInputs } : undefined

        inputs && await findAllAppointments({
          variables: {
            appointmentInput: { ...inputs, searchString: searchQuery }
          },
        })
      }
    } catch (error) { }
  }, [
    doctorId, getAppointments, page, isSuper, isPracAdmin, practiceId, isFacAdmin, facilityId,
    findAllAppointments, searchQuery
  ])

  useEffect(() => {
    fetchAppointments();
  }, [page, searchQuery, fetchAppointments]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_APPOINTMENT_ID, deleteAppointmentId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleCancelAppointment = async () => {
    if (deleteAppointmentId) {
      await removeAppointment({
        variables: {
          removeAppointment: { id: deleteAppointmentId }
        }
      })
    }
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box py={2} mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(TYPE)}
                {!doctorId && renderTh(DOCTOR)}
                {renderTh(PATIENT)}
                {renderTh(DATE)}
                {renderTh(TIME)}
                {renderTh(FACILITY)}
                {renderTh(STATUS)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || getAppointmentsLoading) ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                appointments?.map((appointment: AppointmentPayload['appointment']) => {
                  const {
                    id, scheduleStartDateTime, provider, facility, patient, appointmentType, status, scheduleEndDateTime
                  } = appointment || {};
                  const { name } = facility || {};
                  const { firstName, lastName } = patient || {};
                  const { name: type } = appointmentType || {};
                  const { firstName: doctorFN, lastName: doctorLN } = provider || {};
                  const { text, textColor } = appointmentStatus(status || '')

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{type}</TableCell>
                      {!doctorId && <TableCell scope="row">{doctorFN} {doctorLN}</TableCell>}
                      <TableCell scope="row">{firstName} {lastName}</TableCell>

                      <TableCell scope="row">
                        {getFormattedDate(scheduleStartDateTime || '')}
                      </TableCell>

                      <TableCell scope="row">
                        {getStandardTime(scheduleStartDateTime || '')} - {getStandardTime(scheduleEndDateTime || '')}
                      </TableCell>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">
                        <Box className={classes.status} component='span' color={textColor} border={`1px solid ${textColor}`}>
                          {text}
                        </Box>
                      </TableCell>

                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={classes.iconsBackground} onClick={() => {
                            moment(getISOTime(scheduleStartDateTime || '')).diff(moment(), 'hours') <= 1 ?
                              Alert.info(CANCEL_TIME_EXPIRED_MESSAGE) : onDeleteClick(id || '')
                          }}>
                            <TrashNewIcon />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && !getAppointmentsLoading && appointments?.length === 0) || error || doctorAppointmentError) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={APPOINTMENT}
            isOpen={openDelete}
            isLoading={deleteAppointmentLoading}
            description={DELETE_APPOINTMENT_DESCRIPTION}
            handleDelete={handleCancelAppointment}
            setOpen={(open: boolean) => dispatch({
              type: ActionType.SET_OPEN_DELETE, openDelete: open
            })}
          />
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default AppointmentsTable;
