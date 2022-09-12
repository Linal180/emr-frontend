// packages block
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Close, VideocamOutlined } from '@material-ui/icons';
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography } from '@material-ui/core';
// component block
import Alert from '../../../common/Alert';
import ConfirmationModal from '../../../common/ConfirmationModal';
// constant, assets and styles block
import history from '../../../../history';
import { AppointmentCardProps } from '../../../../interfacesTypes';
import { useCalendarStyles } from '../../../../styles/calendarStyles';
import { DeleteAppointmentIcon, EditAppointmentIcon } from '../../../../assets/svgs';
import {
  Action, appointmentReducer, initialState, State, ActionType
} from '../../../../reducers/appointmentReducer';
import {
  useGetAppointmentLazyQuery, useCancelAppointmentMutation, AppointmentCreateType
} from '../../../../generated/graphql';
import {
  appointmentStatus, getAppointmentDate, getAppointmentDatePassingView, getAppointmentTime, getISOTime, isSuperAdmin
} from '../../../../utils';
import {
  APPOINTMENT_CANCEL_REASON, CANCEL_RECORD, PROVIDER_NAME, APPOINTMENT, APPOINTMENT_DETAILS, PRIMARY_INSURANCE,
  CANCEL_APPOINTMENT_DESCRIPTION, CHECK_IN_ROUTE, TELEHEALTH_URL, REASON, FACILITY_NAME, APPOINTMENT_TYPE,
  CANCEL_TIME_EXPIRED_MESSAGE, CANT_CANCELLED_APPOINTMENT, APPOINTMENTS_ROUTE, TELEHEALTH, CANCEL_TIME_PAST_MESSAGE,
} from '../../../../constants';
import { AuthContext } from '../../../../context';

const AppointmentCard = ({ tooltip, setCurrentView, setCurrentDate, reload }: AppointmentCardProps): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const { visible, onHide, appointmentMeta } = tooltip

  const classes = useCalendarStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const { appOpen, openDelete } = state;
  const isSuper = isSuperAdmin(roles)

  const id = appointmentMeta?.data.appointmentId
  const appReason = appointmentMeta?.data?.reason
  const patientName = appointmentMeta?.data.title

  const patientId = appointmentMeta?.data.patientId
  const appCancelToken = appointmentMeta?.data.token
  const facilityName = appointmentMeta?.data?.facilityName

  const providerName = appointmentMeta?.data?.providerName
  const appDate = getAppointmentDate(appointmentMeta?.data.startDate)
  const appEndTime = getAppointmentTime(appointmentMeta?.data.endDate)

  const appStartTime = getAppointmentTime(appointmentMeta?.data.startDate)
  const scheduleStartDateTime = appointmentMeta?.data.scheduleStartDateTime
  const appPrimaryInsurance = appointmentMeta?.data?.primaryInsurance

  const appointmentDatePassingView = appointmentMeta && appointmentMeta?.data.startDate
  const appointmentCreateType = appointmentMeta?.data?.appointmentCreateType
  const status = appointmentMeta?.data?.rawStatus
  const { text: appointmentArrivalStatus } = appointmentStatus(status || '')

  const [getAppointment] = useGetAppointmentLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response;
        if (appointment && status && status === 200) {
          const { appointmentCreateType } = appointment;
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
      variables: { getAppointment: { id: id.toString() } },
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
    await cancelAppointment({
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
    id && fetchAppointment()
  }, [id, fetchAppointment]);


  useEffect(() => {
    typeof visible === 'boolean' && dispatch({ type: ActionType.SET_APP_OPEN, appOpen: visible })
  }, [appointmentMeta?.data.appointmentStatus, visible,])

  useEffect(() => {
    if (patientName === "Show More" && visible === true) {
      onHide && onHide()
      setCurrentDate(getAppointmentDatePassingView(appointmentDatePassingView))
      setCurrentView('Day')
    }
  }, [appointmentDatePassingView, onHide, patientName, setCurrentDate, setCurrentView, visible])

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
      open={appOpen} aria-labelledby="alert-dialog-title"
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
                <IconButton size='small' onClick={() => deleteAppointmentHandler(scheduleStartDateTime)}>
                  <DeleteAppointmentIcon />
                </IconButton>

                <IconButton size='small' aria-label="edit" onClick={handleEdit}>
                  <EditAppointmentIcon />
                </IconButton>

                <IconButton size='small' aria-label="close" onClick={handleClose}>
                  <Close />
                </IconButton>
              </Box>
            }
            className={classes.cardHeader}
          />

          <Box className={classes.cardText}>
            <Box pb={3} display="flex" justifyContent="space-between" alignItems="flex-start">
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
              <Typography variant="body2">{appointmentMeta?.data?.appointmentType?.name}</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' pb={1}>
              <Typography variant="body1">{FACILITY_NAME}</Typography>
              <Typography variant="body2">{facilityName ?? 'N/A'}</Typography>
            </Box>

            {providerName !== 'undefined undefined' && <Box display='flex' justifyContent='space-between' pb={1}>
              <Typography variant="body1">{PROVIDER_NAME}</Typography>
              <Typography variant="body2">{providerName}</Typography>
            </Box>}

            <Box display='flex' justifyContent='space-between' pb={1}>
              <Typography variant="body1">{REASON}</Typography>
              <Typography variant="body2">{appReason === '' ? 'N/A' : appReason}</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' pb={1}>
              <Typography variant="body1">{PRIMARY_INSURANCE}</Typography>
              <Typography variant="body2">{appPrimaryInsurance === '' ? 'N/A' : appPrimaryInsurance}</Typography>
            </Box>

            <ConfirmationModal
              isCalendar={true}
              actionText={CANCEL_RECORD}
              title={APPOINTMENT_DETAILS}
              isOpen={openDelete}
              isLoading={cancelAppointmentLoading}
              description={CANCEL_APPOINTMENT_DESCRIPTION}
              setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
              handleDelete={handleCancelAppointment}
            />
          </Box>
        </Card>
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
