// packages block
import {
  ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer
} from "react";
import dotenv from 'dotenv';
import moment from "moment";
import { Link } from "react-router-dom";
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight, Sort, } from "@material-ui/icons";
import {
  Box, Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
// components block
import Alert from "./Alert";
import Search from "./Search";
import Selector from "./Selector";
import DatePicker from "./DatePicker";
import TableLoader from "./TableLoader";
import ConfirmationModal from "./ConfirmationModal";
import ServicesSelector from "./Selector/ServiceSelector";
import NoDataFoundComponent from "./NoDataFoundComponent";
import FacilitySelector from "./Selector/FacilitySelector";
import AreYouSureModal from "./AreYouSureModal";
import Loader from "./Loader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import history from "../../history";
import { AuthContext } from "../../context";
import { useTableStyles } from "../../styles/tableStyles";
import { AppointmentsTableProps, SelectorOption, StatusInputProps } from "../../interfacesTypes";
import { BellIconNew, CheckInTickIcon, EditNewIcon, TrashNewIcon, VideoIcon } from "../../assets/svgs";
import {
  Action, ActionType, appointmentReducer, initialState, State
} from "../../reducers/appointmentReducer";
import {
  appointmentStatus, AppointmentStatusStateMachine, canUpdateAppointmentStatus, checkPermission,
  convertDateFromUnix, getAppointmentStatus, getCheckInStatus, getISOTime, getPageNumber,
  hasEncounter, isOnlyDoctor, isPracticeAdmin, isSuperAdmin, getAppointmentDateWithDay,
  isUserAdmin, renderTh, setRecord, sortingArray, isLast, getStandardTime, getStandardTimeDuration,
} from "../../utils";
import {
  AppointmentCreateType, AppointmentPayload, AppointmentsPayload, useFindAllAppointmentsLazyQuery,
  useRemoveAppointmentMutation, useUpdateAppointmentMutation, AppointmentStatus, useSendAppointmentReminderMutation,
} from "../../generated/graphql";
import {
  ACTION, APPOINTMENT, AppointmentSearchingTooltipData, APPOINTMENTS_ROUTE,
  APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY, APPOINTMENT_TYPE, ARRIVAL_STATUS, ASC, CANCEL_TIME_EXPIRED_MESSAGE,
  CANCEL_TIME_PAST_MESSAGE, CANT_CANCELLED_APPOINTMENT, CHECK_IN_ROUTE, DATE, DELETE_APPOINTMENT_DESCRIPTION,
  DESC, EMPTY_OPTION, FACILITY, MINUTES, PATIENT, EIGHT_PAGE_LIMIT, STAGE, TELEHEALTH_URL, TIME, TYPE,
  USER_PERMISSIONS, VIEW_ENCOUNTER, PAGE_LIMIT, TODAY, APPOINTMENT_REMINDER_SENT_SUCCESSFULLY, SENDING_APPOINTMENT_REMINDER,
  PATIENT_EMAIL_PHONE_INFO_MISSING, ROOM_TEXT, N_A
} from "../../constants";

dotenv.config()

const AppointmentsTable: FC<AppointmentsTableProps> = ({ doctorId }): JSX.Element => {
  const classes = useTableStyles();
  const { user, currentUser, userPermissions } = useContext(AuthContext)

  const { facility, roles } = user || {}
  const isAdminUser = isUserAdmin(roles)

  const { id: providerId } = currentUser || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);

  const { id: facilityId, practiceId } = facility || {}
  const canDelete = checkPermission(userPermissions, USER_PERMISSIONS.removeAppointment)
  const isDoctor = isOnlyDoctor(roles)

  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const methods = useForm<StatusInputProps>({ mode: "all" });

  const { setValue, watch } = methods
  const {
    page, totalPages, deleteAppointmentId, isEdit, appointmentId, openDelete, searchQuery,
    appointments, sortBy, filterFacilityId, isReminderModalOpen, reminderId, prevStatus
  } = state;
  const { status, serviceId, appointmentDate } = watch()
  const { value: appointmentTypeId } = serviceId ?? {}

  const resetPage = () => dispatch({ type: ActionType.SET_PAGE, page: 1 })
  const setDate = (newDate?: string) => {
    const date = newDate || moment().format('MM-DD-YYYY');
    setValue('appointmentDate', date)
    dispatch({ type: ActionType.SET_SELECT_DATE, selectDate: date });
    resetPage()
  };

  const getPreviousDate = () => {
    const previousDate = moment(moment(appointmentDate).subtract(1, 'day'), 'MM-DD-YYYY').format()
    setDate(previousDate)
  }

  const getNextDate = () => {
    const nextDate = moment(moment(appointmentDate).add(1, 'day'), 'MM-DD-YYYY').format();
    setDate(nextDate)
  }

  const [findAllAppointments, { loading, error }] = useFindAllAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { appointments, pagination } = findAllAppointments

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }

        if (!!appointments?.length) {
          dispatch({
            type: ActionType.SET_APPOINTMENTS,
            appointments: sortingArray<typeof appointments>(appointments,
              'scheduleStartDateTime', sortBy) as AppointmentsPayload['appointments']
          });
        } else {
          dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
        }
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

  const clearReminder = () => {
    dispatch({ type: ActionType.SET_REMINDER_MODAL_OPEN, isReminderModalOpen: false })
    dispatch({ type: ActionType.SET_REMINDER_ID, reminderId: '' })
  }

  const [sendAppointmentReminder, { loading: sendAppointmentReminderLoading }] = useSendAppointmentReminderMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { sendAppointmentReminder: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_REMINDER_SENT_SUCCESSFULLY);
          clearReminder()
        }
      }
    }
  });

  const sendReminder = async () => {
    try {
      const timeZone = moment.tz.guess();
      await sendAppointmentReminder({
        variables: { appointmentReminderInput: { appointmentId: reminderId, timeZone: timeZone } }
      })
    } catch (error) { }
  }

  const [removeAppointment, { loading: deleteAppointmentLoading }] = useRemoveAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      if (data) {
        const { removeAppointment: { response } } = data

        if (response) {
          try {
            const { message } = response

            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

            if (!!appointments && (appointments.length > 1 || isLast(appointments.length, page))) {
              await fetchAppointments()
            } else {

              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, appointments?.length || 0) })
            }
          } catch (error) { }
        }
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    try {
      dispatch({ type: ActionType.SET_SORT_BY, sortBy: ASC })
      const pageInputs = { paginationOptions: { page, limit: EIGHT_PAGE_LIMIT } }
      const inputs = isSuper
        ? { facilityId: filterFacilityId, providerId: doctorId }
        : isPracticeUser
          ? { practiceId, facilityId: filterFacilityId, providerId: doctorId }
          : isDoctor
            ? { providerId }
            : { facilityId, providerId: doctorId }

      inputs && await findAllAppointments({
        variables: {
          appointmentInput: {
            ...inputs, ...pageInputs, searchString: searchQuery.trim(),
            appointmentTypeId: appointmentTypeId,
            appointmentDate: moment(appointmentDate).format('YYYY-MM-DD')
          }
        },
      })
    } catch (error) { }
  }, [page, isSuper, filterFacilityId, doctorId, isPracticeUser, practiceId, isDoctor, providerId, facilityId, findAllAppointments, searchQuery, appointmentTypeId, appointmentDate])

  useEffect(() => {
    fetchAppointments();
  }, [page, searchQuery, fetchAppointments, filterFacilityId]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const updateAppointmentData = () => {
    const { id, name } = status || {}
    const appointment = appointments?.find(appointment => appointment?.id === id)
    const updatedAppointment = {
      ...appointment, status: getAppointmentStatus(name || '')
    } as AppointmentPayload['appointment']

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
    deleteAppointmentId &&
      await removeAppointment({
        variables: { removeAppointment: { id: deleteAppointmentId } }
      })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const handleStatusUpdate = (id: string, status: string, aptStatus: AppointmentStatus | undefined) => {
    if (id && status) {
      setValue('status', setRecord(id, status))
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: !!id })
      dispatch({ type: ActionType.SET_APPOINTMENT_ID, appointmentId: id })
      aptStatus && dispatch({ type: ActionType.SET_PREV_STATUS, prevStatus: aptStatus })
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
        if (id && name && name !== '--' && prevStatus) {

          let reason = undefined

          if (prevStatus === AppointmentStatus.Cancelled) {
            const currentStatus = getAppointmentStatus(name || '');
            if (currentStatus !== AppointmentStatus.Cancelled) {
              reason = 'N/A'
            }
          }

          await updateAppointment({
            variables: {
              updateAppointmentInput: {
                id, status: getAppointmentStatus(name) as AppointmentStatus,
                ...(reason && { reason: reason }),
                ...(isCheckedInStatus && {
                  checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a')
                })
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
    if (id) {
      if (isSuper) {
        onDeleteClick(id)
      } else {
        const remainingTime = moment(getISOTime(scheduleStartDateTime || ''))

        remainingTime.isBefore(moment(), 'hours')
          ? Alert.info(CANCEL_TIME_PAST_MESSAGE)
          : remainingTime.diff(moment(), 'hours') <= 1
            ? Alert.info(CANCEL_TIME_EXPIRED_MESSAGE)
            : onDeleteClick(id || '')
      }
    }
  };

  const canBeUpdated = (status: AppointmentStatus) => {
    return status === AppointmentStatus.Cancelled
      || status === AppointmentStatus.NoShow
      || status === AppointmentStatus.Discharged
      || status === AppointmentStatus.Checkout
  };

  const renderIcon = () => <IconButton className={`py-0 ml-5 rotate-Icon ${sortBy === ASC ? 'to-180' : ''}`}
    onClick={() => {
      dispatch({ type: ActionType.SET_SORT_BY, sortBy: sortBy === ASC ? DESC : ASC })

      dispatch({
        type: ActionType.SET_APPOINTMENTS,
        appointments: sortingArray<typeof appointments>(appointments, 'scheduleStartDateTime',
          sortBy === ASC ? DESC : ASC)
      })
    }}
  >
    <Sort />
  </IconButton>;

  const handleAppointmentReminder = (id: string, email: string | undefined | null, phone: string | undefined | null) => {
    if (email && phone) {
      id && dispatch({ type: ActionType.SET_REMINDER_ID, reminderId: id })
      dispatch({ type: ActionType.SET_REMINDER_MODAL_OPEN, isReminderModalOpen: true })
    } else {
      Alert.error(PATIENT_EMAIL_PHONE_INFO_MISSING)
    }
  }

  useEffect(() => {
    setValue('appointmentDate', moment(new Date(), 'MM-DD-YYYY').format())
  }, [setValue])

  if (sendAppointmentReminderLoading) {
    return <Loader loading loaderText={SENDING_APPOINTMENT_REMINDER} />
  }

  return (
    <>
      <Box>
        <Box my={2}>
          <Grid container spacing={3}>
            <Grid item md={3} sm={12} xs={12}>
              <Box mt={2}>
                <Search search={search} info tooltipData={AppointmentSearchingTooltipData} />
              </Box>
            </Grid>

            <Grid item md={9} sm={12} xs={12}>
              <FormProvider {...methods}>
                <Grid container spacing={3}>
                  {isAdminUser &&
                    <Grid item md={3} sm={12} xs={12}>
                      <FacilitySelector
                        addEmpty
                        label={FACILITY}
                        name="facilityId"
                        onSelect={({ id }: SelectorOption) =>
                          dispatch({ type: ActionType.SET_FILTER_FACILITY_ID, filterFacilityId: id })}
                      />
                    </Grid>
                  }

                  <Grid item md={3} sm={12} xs={12}>
                    <ServicesSelector
                      name="serviceId"
                      label={APPOINTMENT_TYPE}
                      shouldEmitFacilityId={isAdminUser}
                    />
                  </Grid>

                  <Grid item md={isAdminUser ? 6 : 8} sm={12} xs={12}>
                    <Box className="date-box-wrap">
                      <Typography variant="body1" color="textPrimary">{DATE}</Typography>

                      <Box className="date-box" display="flex" alignItems="center">
                        <Button
                          variant="outlined"
                          className="btn-icon"
                          size="small"
                          color="default"
                          onClick={getPreviousDate}
                        >
                          <ChevronLeft />
                        </Button>

                        <Box className="date-input-box" mx={1}>
                          <DatePicker
                            label=""
                            disableFuture={false}
                            name="appointmentDate"
                            // defaultValue={new Date(selectDate)}
                            onSelect={(date: string) => setDate(date)}
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          className="btn-icon"
                          size="small"
                          color="default"
                          onClick={getNextDate}
                        >
                          <ChevronRight />
                        </Button>

                        <Box ml={3} />

                        <Button variant="outlined" size="small" color="default" onClick={() => setDate()}>{TODAY}</Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </FormProvider>
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.mainTableContainer}>
          <Box className="table-overflow appointment-view-list">
            <Table aria-label="customized table" className={classes.table}>
              <TableHead>
                <TableRow>
                  {renderTh(TIME, undefined, undefined, undefined, undefined, renderIcon)}
                  {renderTh(PATIENT)}
                  {renderTh(TYPE)}
                  {renderTh(DATE)}
                  {renderTh(FACILITY)}
                  {renderTh(ROOM_TEXT)}
                  {renderTh(ARRIVAL_STATUS)}
                  {renderTh(STAGE)}
                  {renderTh(ACTION, "center")}
                </TableRow>
              </TableHead>

              <TableBody>
                {(loading) ? (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={8} />
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments?.map((appointment: AppointmentPayload['appointment']) => {
                    const {
                      id, scheduleStartDateTime, facility, patient, appointmentType, status,
                      scheduleEndDateTime, checkInActiveStep, appointmentCreateType, appointmentDate, room
                    } = appointment || {};

                    const { name } = facility || {};
                    const { id: patientId, firstName, lastName, email, contacts } = patient || {};
                    const { phone } = contacts?.find((contact) => contact.primaryContact) || {}
                    const { name: type } = appointmentType || {};
                    const { name: roomName, number: roomNo } = room || {}

                    const cantUpdate = canBeUpdated(status as AppointmentStatus)
                    const { text, textColor, bgColor } = appointmentStatus(status || '')
                    const { stage, stageColor } = getCheckInStatus(Number(checkInActiveStep || 0),
                      status ?? '', (appointmentCreateType || '') as AppointmentCreateType)

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
                            {getAppointmentDateWithDay(appointmentDate || '', 'YYYY-MM-DD')}

                            {hasEncounter(status as AppointmentStatus) &&
                              <Link to={`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`}>
                                {VIEW_ENCOUNTER}
                              </Link>}
                          </Box>
                        </TableCell>

                        <TableCell scope="row">{name}</TableCell>
                        <TableCell scope="row">{roomNo ? `${roomNo || ''} : ${roomName || ''}` : N_A}</TableCell>
                        <TableCell scope="row">
                          {id && <>
                            {isEdit && appointmentId === id ?
                              <FormProvider {...methods}>
                                <Selector
                                  label=""
                                  focus
                                  value={{ id, name: text }}
                                  name="status"
                                  options={AppointmentStatusStateMachine(
                                    status || AppointmentStatus.Scheduled, id, appointmentCreateType
                                  )}
                                  onSelect={(({ name }: SelectorOption) => onSubmit({ id, name }))}
                                  onOutsideClick={clearEdit}
                                  isEdit={isEdit}
                                />
                              </FormProvider>
                              : <Box p={0} onClick={() => id && status !== AppointmentStatus.Discharged && status !== AppointmentStatus.Checkout &&
                                handleStatusUpdate(id, text, status)}
                                className={`${classes.status} pointer-cursor`}
                                component='span' color={textColor}
                                display="flex"
                                flexDirection="column"
                              >
                                {text}
                              </Box>}
                          </>}
                        </TableCell>

                        <TableCell scope="row">
                          {id && <Box className={classes.selectorBox}>
                            <Box p={0} className={classes.status} component='span' color={textColor}
                              display="flex" flexDirection="column"
                            >
                              <Box display="flex" color={stageColor}>
                                {stage}
                              </Box>
                            </Box>
                          </Box>}
                        </TableCell>

                        <TableCell scope="row">
                          <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                            {(appointmentCreateType === AppointmentCreateType.Telehealth &&
                              status !== AppointmentStatus.Cancelled) ?
                              <Box className={classes.iconsBackground} onClick={() => window.open(TELEHEALTH_URL)}>
                                <VideoIcon />
                              </Box> :
                              (status && !(status === AppointmentStatus.Cancelled)) &&
                              <Box className={classes.iconsBackground}
                                onClick={() => canUpdateAppointmentStatus(status) ?
                                  id && patientId && handleCheckIn(id, patientId)
                                  : history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)
                                }>
                                <CheckInTickIcon />
                              </Box>
                            }

                            {status === AppointmentStatus.Cancelled &&
                              appointmentCreateType === AppointmentCreateType.Telehealth &&
                              <Box className={classes.iconsBackgroundDisabled}>
                                <IconButton size='small'>
                                  <VideoIcon />
                                </IconButton>
                              </Box>
                            }

                            {status === AppointmentStatus.Cancelled &&
                              appointmentCreateType === AppointmentCreateType.Appointment &&
                              <Box className={classes.iconsBackgroundDisabled}>
                                <IconButton size='small' >
                                  <CheckInTickIcon />
                                </IconButton>
                              </Box>
                            }

                            <Box className={`${status === AppointmentStatus.Cancelled || status === AppointmentStatus.Discharged || status === AppointmentStatus.Checkout ? classes.iconsBackgroundDisabled : classes.iconsBackground}`}>
                              <Button
                                onClick={() => id && handleAppointmentReminder(id, email, phone)}
                                disabled={status === AppointmentStatus.Cancelled || status === AppointmentStatus.Discharged || status === AppointmentStatus.Checkout}
                              >
                                <BellIconNew />
                              </Button>
                            </Box>

                            <Box className={cantUpdate ? classes.iconsBackgroundDisabled : classes.iconsBackground}>
                              <Button component={Link} to={`${APPOINTMENTS_ROUTE}/${id}`}
                                disabled={cantUpdate}
                              >
                                <EditNewIcon />
                              </Button>
                            </Box>

                            <Box className={`${classes.iconsBackground} ${canDelete ? '' : 'disable-icon'}`}>
                              <Button disableElevation onClick={() => scheduleStartDateTime && id
                                && deleteAppointmentHandler(scheduleStartDateTime, id)} disabled={!canDelete}
                              >
                                <TrashNewIcon />
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {((!loading && appointments?.length === 0) || error) &&
              <Box display="flex" justifyContent="center" pb={12} pt={5}>
                <NoDataFoundComponent />
              </Box>
            }

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
      </Box>

      {isReminderModalOpen &&
        <AreYouSureModal
          isOpen={isReminderModalOpen}
          handleClose={clearReminder}
          content="Send Reminder to Patient?"
          handleSubmit={() => sendReminder()}
        />
      }

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
