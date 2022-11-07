// packages block
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Close, VideocamOutlined } from '@material-ui/icons';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../../common/Alert';
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
// constant, assets and styles block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { AppointmentCardProps } from '../../../../interfacesTypes';
import { useCalendarStyles } from '../../../../styles/calendarStyles';
import { DeleteAppointmentIcon, EditAppointmentIcon } from '../../../../assets/svgs';
import {
  Action, appointmentReducer, initialState, State, ActionType
} from '../../../../reducers/appointmentReducer';
import {
  useGetAppointmentLazyQuery, useCancelAppointmentMutation, AppointmentCreateType, AppointmentPayload, AppointmentStatus
} from '../../../../generated/graphql';
import {
  appointmentStatus, getAppointmentDatePassingView, getAppointmentDateWithDay, getDocumentDateFromTimestamps, getISOTime, isSuperAdmin
} from '../../../../utils';
import {
  APPOINTMENT_CANCEL_REASON, CANCEL_RECORD, PROVIDER_NAME, APPOINTMENT, PRIMARY_INSURANCE,
  CANCEL_APPOINTMENT_DESCRIPTION, CHECK_IN_ROUTE, TELEHEALTH_URL, REASON, FACILITY_NAME, APPOINTMENT_TYPE,
  CANCEL_TIME_EXPIRED_MESSAGE, CANT_CANCELLED_APPOINTMENT, APPOINTMENTS_ROUTE, TELEHEALTH, CANCEL_TIME_PAST_MESSAGE,
} from '../../../../constants';

const AppointmentCard = ({ tooltip, setCurrentView, setCurrentDate, reload, appOpen: appointmentOpen }: AppointmentCardProps): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const { visible, onHide, appointmentMeta } = tooltip;
  const { data } = appointmentMeta || {}
  const { id, title, startDate } = data || {}

  const classes = useCalendarStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const { openDelete, appointment } = state;
  const isSuper = isSuperAdmin(roles)

  const {
    reason: appReason, patient, token: appCancelToken, facility, provider, scheduleStartDateTime, appointmentDate,
    primaryInsurance: appPrimaryInsurance, scheduleEndDateTime, appointmentCreateType, appointmentType, status
  } = appointment || {}
  const { id: patientId, firstName, lastName } = patient || {}
  const { name: facilityName } = facility || {}
  const { firstName: providerFN, lastName: providerLN } = provider || {}

  const patientName = `${firstName || ''} ${lastName || ''}`
  const providerName = `${providerFN || ''} ${providerLN || ''}`

  const appDate = getAppointmentDateWithDay(appointmentDate || '', 'YYYY-MM-DD', 'MMMM Do YYYY')
  const appEndTime = getDocumentDateFromTimestamps(scheduleEndDateTime || '', 'hh:mm a')
  const appStartTime = getDocumentDateFromTimestamps(scheduleStartDateTime || '', 'hh:mm a')
  const isDisabled = !(status === AppointmentStatus.Scheduled || status === AppointmentStatus.Rescheduled)

  const { text: appointmentArrivalStatus } = appointmentStatus(status || '')

  const [getAppointment, { loading }] = useGetAppointmentLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted(data) {
      const { getAppointment: { response, appointment: appointmentData } } = data;

      if (response) {
        const { status } = response;
        if (appointmentData && status && status === 200) {
          dispatch({ type: ActionType.SET_APPOINTMENT, appointment: appointmentData as AppointmentPayload['appointment'] })
          const { appointmentCreateType } = appointmentData;
          appointmentCreateType && dispatch({
            type: ActionType.SET_APPOINTMENT_CREATE_TYPE,
            appointmentCreateType: appointmentCreateType
          })
        }
      }
    },
  });

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({
      variables: { getAppointment: { id: String(id) } },
    });
  }, [getAppointment, id]);

  const handleClose = () => onHide && onHide()

  const [cancelAppointment, { loading: cancelAppointmentLoading }] = useCancelAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      if (data) {
        const { cancelAppointment: { response } } = data

        if (response) {
          const { message } = response

          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          reload()
          onHide && onHide()
        }
      }
    }
  });

  const handleCancelAppointment = async () => {
    appCancelToken && await cancelAppointment({
      variables: {
        cancelAppointment: { reason: APPOINTMENT_CANCEL_REASON, token: appCancelToken }
      }
    })
  };

  const onDeleteClick = () => {
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
  };

  const handleEdit = () => history.push(`${APPOINTMENTS_ROUTE}/${id}`)

  useEffect(() => {
    id && appointmentOpen && fetchAppointment()
  }, [id, fetchAppointment, appointmentOpen]);


  useEffect(() => {
    if (title === "Show More" && visible === true) {
      onHide && onHide()
      setCurrentDate(getAppointmentDatePassingView(startDate || ''))
      setCurrentView('Day')
    }
  }, [startDate, onHide, title, setCurrentDate, setCurrentView, visible])

  const deleteAppointmentHandler = (scheduleStartDateTime: any) => {
    if (isSuper) {
      onDeleteClick()
    } else {
      const remainingTime = moment(getISOTime(scheduleStartDateTime || ''))

      remainingTime.isBefore(moment(), 'hours')
        ? Alert.info(CANCEL_TIME_PAST_MESSAGE)
        : remainingTime.diff(moment(), 'hours') <= 1
          ? Alert.info(CANCEL_TIME_EXPIRED_MESSAGE)
          : onDeleteClick()
    }
  }

  return (
    <Dialog
      open={visible ?? false} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableEscapeKeyDown keepMounted
      maxWidth="sm" className={classes.dropdown}
    >
      <Box px={4} py={2} className={classes.cardContainer}>
        <Card>
          <CardHeader
            title={APPOINTMENT}
            action={
              <Box>
                <IconButton size='small' onClick={() => deleteAppointmentHandler(scheduleStartDateTime)} disabled={loading || isDisabled}>
                  <DeleteAppointmentIcon />
                </IconButton>

                <IconButton size='small' aria-label="edit" onClick={handleEdit} disabled={loading}>
                  <EditAppointmentIcon />
                </IconButton>

                <IconButton size='small' aria-label="close" onClick={handleClose} disabled={loading}>
                  <Close />
                </IconButton>
              </Box>
            }
            className={classes.cardHeader}
          />
          {loading ? <TableLoader numberOfColumns={1} numberOfRows={8} /> :
            <Box className={classes.cardText}>
              <Box pb={3} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                <Box>
                  <Box maxWidth={300}>
                    <Typography variant='h4' noWrap>{patientName}</Typography>
                  </Box>

                  <Typography variant="body1">{appDate}</Typography>
                  <Typography variant="body1">{appStartTime} - {appEndTime}</Typography>
                </Box>

                {appointmentCreateType === AppointmentCreateType.Appointment
                  ? <Button component={Link}
                    to={`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`}
                    variant="contained" color="primary"
                  >{appointmentArrivalStatus}</Button>
                  : <Button variant="contained" className="blue-button-New" onClick={() => window.open(TELEHEALTH_URL)}>
                    <VideocamOutlined />&nbsp; {TELEHEALTH}
                  </Button>
                }
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{APPOINTMENT_TYPE}</Typography>
                <Typography variant="body2">{appointmentType?.name}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{FACILITY_NAME}</Typography>
                <Typography variant="body2">{facilityName ?? 'N/A'}</Typography>
              </Box>

              {providerName !== ' ' && <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PROVIDER_NAME}</Typography>
                <Typography variant="body2">{providerName}</Typography>
              </Box>}

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{REASON}</Typography>
                <Typography variant="body2">{appReason === '' ? 'N/A' : appReason}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PRIMARY_INSURANCE}</Typography>
                <Typography variant="body2">{appPrimaryInsurance ?? 'N/A'}</Typography>
              </Box>

              <ConfirmationModal
                isCalendar={true}
                actionText={CANCEL_RECORD}
                title={APPOINTMENT}
                isOpen={openDelete}
                isLoading={cancelAppointmentLoading}
                description={CANCEL_APPOINTMENT_DESCRIPTION}
                setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
                handleDelete={handleCancelAppointment}
              />
            </Box>
          }
        </Card>
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
