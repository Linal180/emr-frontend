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
import { EditIcon, TrashIcon } from "../../assets/svgs"
import { useTableStyles } from "../../styles/tableStyles";
import { AppointmentsTableProps } from "../../interfacesTypes";
import { getFormattedDate, renderTh, getISOTime, appointmentStatus, getStandardTime } from "../../utils";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../reducers/appointmentReducer";
import {
  AppointmentPayload, AppointmentsPayload, useFindAllAppointmentsLazyQuery, useRemoveAppointmentMutation,
  useGetAppointmentsLazyQuery
} from "../../generated/graphql";
import {
  ACTION, DOCTOR, PATIENT, DATE, DURATION, FACILITY, PAGE_LIMIT, CANT_CANCELLED_APPOINTMENT, STATUS,
  TYPE, APPOINTMENTS_ROUTE, DELETE_APPOINTMENT_DESCRIPTION, APPOINTMENT, MINUTES, CANCEL_TIME_EXPIRED_MESSAGE,
} from "../../constants";

dotenv.config()

const AppointmentsTable: FC<AppointmentsTableProps> = ({ doctorId }): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility } = user || {}
  const { id: facilityId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, totalPages, deleteAppointmentId, openDelete, searchQuery, appointments } = state;

  const [findAllAppointments, { loading, error }] = useFindAllAppointmentsLazyQuery({
    variables: {
      appointmentInput: {
        paginationOptions: {
          page, limit: PAGE_LIMIT
        }
      }
    },

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

        if (!searchQuery && pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
          dispatch({
            type: ActionType.SET_APPOINTMENTS,
            appointments: appointments as AppointmentsPayload['appointments']
          });
        }
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
        const { appointments } = getAppointments

        if (!searchQuery) {
          dispatch({
            type: ActionType.SET_APPOINTMENTS,
            appointments: appointments as AppointmentsPayload['appointments']
          });
        }
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
            await findAllAppointments()
          } catch (error) { }
        }
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    try {
      doctorId ?
        await getAppointments({
          variables: { getAppointments: { doctorId, facilityId } }
        })
        : await findAllAppointments()
    } catch (error) { }
  }, [doctorId, getAppointments, facilityId, findAllAppointments])

  useEffect(() => {
    if (!searchQuery) {
      fetchAppointments();
    }
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

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Box className={classes.searchContainer}>
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
              {renderTh(DURATION)}
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
                  id, scheduleStartDateTime, provider, facility, patient, appointmentType, status
                } = appointment || {};
                const { name } = facility || {};
                const { firstName, lastName } = patient || {};
                const { duration, name: type } = appointmentType || {};
                const { firstName: doctorFN, lastName: doctorLN } = provider || {};
                const { text, bgColor, textColor } = appointmentStatus(status || '')

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{type}</TableCell>
                    {!doctorId && <TableCell scope="row">{doctorFN} {doctorLN}</TableCell>}
                    <TableCell scope="row">{firstName} {lastName}</TableCell>

                    <TableCell scope="row">
                      {getFormattedDate(scheduleStartDateTime || '')} {getStandardTime(scheduleStartDateTime || '')}
                    </TableCell>

                    <TableCell scope="row">{duration} {MINUTES}</TableCell>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">
                      <Box className={classes.status} component='span' bgcolor={bgColor} color={textColor}>
                        {text}
                      </Box>
                    </TableCell>

                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                          <Box className={classes.iconsBackground}>
                            <EditIcon />
                          </Box>
                        </Link>

                        <Box className={classes.iconsBackground} onClick={() => {
                          moment(getISOTime(scheduleStartDateTime || '')).diff(moment(), 'hours') <= 1 ?
                            Alert.info(CANCEL_TIME_EXPIRED_MESSAGE) : onDeleteClick(id || '')
                        }}>
                          <TrashIcon />
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

        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={3}>
            <Pagination
              shape="rounded"
              page={page}
              count={totalPages}
              onChange={handleChange}
            />
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
  );
};

export default AppointmentsTable;
