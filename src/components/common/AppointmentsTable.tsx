// packages block
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import dotenv from 'dotenv';
import moment from "moment";
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { VideocamOutlined } from "@material-ui/icons";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
// components block
import Alert from "./Alert";
import ConfirmationModal from "./ConfirmationModal";
import NoDataFoundComponent from "./NoDataFoundComponent";
import Search from "./Search";
import Selector from "./Selector";
import TableLoader from "./TableLoader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { CheckInTickIcon, EditNewIcon, TrashNewIcon } from "../../assets/svgs";
import {
  ACTION, APPOINTMENT, AppointmentSearchingTooltipData, APPOINTMENTS_ROUTE, CHECK_IN_ROUTE, DATE,
  APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY, ARRIVAL_STATUS, TYPE, VIEW_ENCOUNTER, TIME,
  CANCEL_TIME_EXPIRED_MESSAGE, CANCEL_TIME_PAST_MESSAGE, CANT_CANCELLED_APPOINTMENT, STAGE,
  DELETE_APPOINTMENT_DESCRIPTION, EMPTY_OPTION, FACILITY, MINUTES, PAGE_LIMIT, PATIENT, TELEHEALTH_URL,
} from "../../constants";
import { AuthContext } from "../../context";
import {
  AppointmentCreateType,
  AppointmentPayload, AppointmentsPayload, AppointmentStatus, useFindAllAppointmentsLazyQuery,
  useGetAppointmentsLazyQuery, useRemoveAppointmentMutation, useUpdateAppointmentMutation
} from "../../generated/graphql";
import history from "../../history";
import { AppointmentsTableProps, SelectorOption, StatusInputProps } from "../../interfacesTypes";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../reducers/appointmentReducer";
import { useTableStyles } from "../../styles/tableStyles";
import {
  appointmentStatus, AppointmentStatusStateMachine, canUpdateAppointmentStatus, convertDateFromUnix,
  getAppointmentStatus, getCheckInStatus, getDateWithDay, getISOTime, getStandardTime, getStandardTimeDuration,
  isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderTh, setRecord
} from "../../utils";

dotenv.config()

const AppointmentsTable: FC<AppointmentsTableProps> = ({ doctorId }): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, totalPages, deleteAppointmentId, isEdit, appointmentId, openDelete, searchQuery, appointments } = state;
  const methods = useForm<StatusInputProps>({
    mode: "all",
  });
  const { setValue, watch } = methods
  const { status } = watch()

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
      } else {
        dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
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

  const [updateAppointment] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY);
          updateAppointmentData()
          clearEdit()
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
          isPracticeUser ? { practiceId, ...pageInputs } :
            isFacAdmin ? { facilityId, ...pageInputs } : undefined

        inputs && await findAllAppointments({
          variables: {
            appointmentInput: { ...inputs, searchString: searchQuery }
          },
        })
      }
    } catch (error) { }
  }, [
    doctorId, getAppointments, page, isSuper, isPracticeUser, practiceId, isFacAdmin, facilityId,
    findAllAppointments, searchQuery
  ])

  useEffect(() => {
    fetchAppointments();
  }, [page, searchQuery, fetchAppointments]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const updateAppointmentData = () => {
    const { id, name } = status || {}
    const appointment = appointments?.find(appointment => appointment?.id === id)
    const updatedAppointment = { ...appointment, status: getAppointmentStatus(name || '') } as AppointmentPayload['appointment']
    const index = appointments?.findIndex(appointment => appointment?.id === id)

    if (!!updatedAppointment && !!appointments && !!appointments?.length && index !== undefined) {
      appointments.splice(index, 1, updatedAppointment)

      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments })
    }
  }

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

  const handleStatusUpdate = (id: string, status: string) => {
    if (id && status) {
      setValue('status', setRecord(id, status))
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: !!id })
      dispatch({ type: ActionType.SET_APPOINTMENT_ID, appointmentId: id })
    }
  }

  const clearEdit = () => {
    setValue('status', EMPTY_OPTION)
    dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
    dispatch({ type: ActionType.SET_APPOINTMENT_ID, appointmentId: '' })
  }

  const onSubmit = async ({ id, name }: SelectorOption) => {
    try {
      if (getAppointmentStatus(name || '') === AppointmentStatus.Rescheduled) {
        history.push(`${APPOINTMENTS_ROUTE}/${id}`)
      } else {
        const isCheckedInStatus = getAppointmentStatus(name || '') === AppointmentStatus.Arrived

        if (id && name && name !== '--') {
          await updateAppointment({
            variables: {
              updateAppointmentInput: {
                id,
                status: getAppointmentStatus(name) as AppointmentStatus,
                ...(isCheckedInStatus && { checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a') })
              }
            }
          })
        } else clearEdit()
      }
    } catch (error) { }
  }

  const handleCheckIn = async (id: string, patientId: string) => {
    const { data } = await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id, status: AppointmentStatus.Arrived,
          checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a')
        }
      }
    })

    const { updateAppointment: updateAppointmentResponse } = data ?? {}
    const { response } = updateAppointmentResponse ?? {}
    if (response) {
      const { status } = response

      if (patientId && status && status === 200) {
        history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)
      }
    }
  }

  const deleteAppointmentHandler = (scheduleStartDateTime: string, id: string) => {
    moment(getISOTime(scheduleStartDateTime || '')).isBefore(moment(), 'hours')
      ? Alert.info(CANCEL_TIME_PAST_MESSAGE)
      : moment(getISOTime(scheduleStartDateTime || '')).diff(moment(), 'hours') <= 1
        ? Alert.info(CANCEL_TIME_EXPIRED_MESSAGE)
        : onDeleteClick(id || '')
  }

  return (
    <>
      <Box maxHeight="calc(100vh - 190px)" className="overflowY-auto">
        <Box py={2} mb={2} maxWidth={450}>
          <Search search={search} info tooltipData={AppointmentSearchingTooltipData} />
        </Box>

        <Box className="table-overflow appointment-view-list">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(TIME)}
                {renderTh(PATIENT)}
                {renderTh(TYPE)}
                {renderTh(DATE)}
                {renderTh(FACILITY)}
                {renderTh(ARRIVAL_STATUS)}
                {renderTh(STAGE)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>
            <TableBody>
              {(loading || getAppointmentsLoading) ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={8} />
                  </TableCell>
                </TableRow>
              ) : (
                appointments?.map((appointment: AppointmentPayload['appointment']) => {
                  const {
                    id, scheduleStartDateTime, facility, patient, appointmentType, status, scheduleEndDateTime, checkInActiveStep, appointmentCreateType
                  } = appointment || {};
                  const { name } = facility || {};
                  const { id: patientId, firstName, lastName } = patient || {};
                  const { name: type } = appointmentType || {};
                  const { text, textColor, bgColor } = appointmentStatus(status || '')
                  const { stage, stageColor } = getCheckInStatus(Number(checkInActiveStep || 0), status ?? '')

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">
                        <Box display="flex" borderLeft={`4px solid ${textColor}`} bgcolor={bgColor}
                          className="custom-cell"
                        >
                          <Typography variant="h5">{getStandardTime(scheduleStartDateTime || '')}</Typography>
                          <Box px={0.5} />
                          <Typography variant="body2">
                            ({getStandardTimeDuration(scheduleStartDateTime || '', scheduleEndDateTime || '')} {MINUTES})
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell scope="row">{firstName} {lastName}</TableCell>
                      <TableCell scope="row">{type}</TableCell>
                      <TableCell scope="row">
                        <Box display='flex' flexDirection='column'>
                          {getDateWithDay(scheduleStartDateTime || '')}

                          {status === AppointmentStatus.Arrived &&
                            <Link to={`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`}>
                              {VIEW_ENCOUNTER}
                            </Link>}
                        </Box>
                      </TableCell>

                      <TableCell scope="row">{name}</TableCell>

                      <TableCell scope="row">
                        {id && <Box className={classes.selectorBox}>
                          {isEdit && appointmentId === id ?
                            <FormProvider {...methods}>
                              <Selector
                                label=""
                                value={{ id, name: text }}
                                name="status"
                                options={AppointmentStatusStateMachine(status || AppointmentStatus.Scheduled, id, appointmentCreateType)}
                                onSelect={(({ name }: SelectorOption) => onSubmit({ id, name }))}
                                onOutsideClick={clearEdit}
                                isEdit={isEdit}
                              />
                            </FormProvider>
                            : <Box p={0} onClick={() => id && status !== AppointmentStatus.Discharged && handleStatusUpdate(id, text)}
                              className={`${classes.status} pointer-cursor`}
                              component='span' color={textColor}
                              display="flex"
                              flexDirection="column"
                            >
                              {text}
                            </Box>}
                        </Box>}
                      </TableCell>
                      <TableCell scope="row">
                        {id && <Box className={classes.selectorBox}>
                          <Box p={0} onClick={() => id && status !== AppointmentStatus.Discharged && handleStatusUpdate(id, text)}
                            className={classes.status}
                            component='span' color={textColor}
                            display="flex"
                            flexDirection="column"
                          >
                            <Box display="flex" color={stageColor}>
                              {stage}
                            </Box>
                          </Box>
                        </Box>}
                      </TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          {
                            appointmentCreateType === AppointmentCreateType.Telehealth ?
                              <Box className={classes.iconsBackground} onClick={()=>window.open(TELEHEALTH_URL)}>
                                <VideocamOutlined />
                              </Box> :
                              status && <Box className={classes.iconsBackground}
                                onClick={() => canUpdateAppointmentStatus(status) ?
                                  id && patientId && handleCheckIn(id, patientId)
                                  : history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)
                                }>
                                <CheckInTickIcon />
                              </Box>
                          }

                          <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={classes.iconsBackground}
                            onClick={() => scheduleStartDateTime && id && deleteAppointmentHandler(scheduleStartDateTime, id)}
                          >
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
