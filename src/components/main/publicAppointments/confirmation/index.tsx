// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
// components block
import Alert from "../../../../components/common/Alert";
import Backdrop from "../../../../components/common/Backdrop";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
// utils, styles  block, constants
import history from "../../../../history";
import { ParamsType } from "../../../../interfacesTypes";
import { GREY_ELEVEN, GREY_THREE, GREY_TWO, WHITE, WHITE_TWO } from '../../../../theme';
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles";
import {
  AppointmentPayload, AppointmentStatus, useCancelAppointmentMutation, useGetAppointmentLazyQuery
} from "../../../../generated/graphql";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../reducers/appointmentReducer";
import {
  APPOINTMENT_NOT_FOUND, PATIENT_APPOINTMENT_FAIL, APPOINTMENT, DELETE_APPOINTMENT_DESCRIPTION,
  CANT_CANCELLED_APPOINTMENT, TOKEN_NOT_FOUND, PATIENT_CANCELLED_APPOINTMENT, PATIENT_APPOINTMENT_CANCEL,
  APPOINTMENT_CONFIRMED, CANCEL_APPOINTMENT_TEXT, CONTINUE_TEXT, APPOINTMENT_CONFIRM_SUBHEADING,
  appointmentConfirmationDescription, PATIENT_INFORMATION_ROUTE
} from '../../../../constants';

const AppointmentConfirmationComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = confirmationStyles();
  const [{ appointment, openDelete }, dispatch] =
    useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { scheduleStartDateTime, token, patientId } = appointment || {}

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "cache-and-network",

    onError() {
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      try {
        const { getAppointment: { response, appointment } } = data;

        if (response) {
          const { status } = response

          if (appointment && status && status === 200) {
            const { status } = appointment

            if (status === AppointmentStatus.Cancelled) {
              history.push(PATIENT_APPOINTMENT_CANCEL)
            }

            dispatch({
              type: ActionType.SET_APPOINTMENT,
              appointment: appointment as AppointmentPayload['appointment']
            })
          }
        }
      } catch (error) { }
    }
  });

  const [cancelAppointment, { loading: cancelAppointmentLoading }] = useCancelAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { cancelAppointment: { response } } = data

        if (response) {
          const { message } = response

          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          history.push(PATIENT_APPOINTMENT_CANCEL)
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getAppointment({
        variables: { getAppointment: { id } }
      })
    } else {
      Alert.error(APPOINTMENT_NOT_FOUND)
      history.push(PATIENT_APPOINTMENT_FAIL)
    }
  }, [getAppointment, id])

  const handleCancelAppointment = () => {
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
  };

  const removeAppointment = async () => {
    if (token) {
      await cancelAppointment({
        variables: { cancelAppointment: { token, reason: PATIENT_CANCELLED_APPOINTMENT } }
      })
    } else {
      Alert.error(TOKEN_NOT_FOUND)
    }
  };

  return (
    <Box bgcolor={WHITE_TWO} display="flex" justifyContent="center" alignItems="center">
      {(getAppointmentLoading || !appointment) ? <Backdrop loading={true} /> : (

        <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
          <Card>
            <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant="h4"><strong>{APPOINTMENT_CONFIRMED}</strong></Typography>
            </Box>

            <Box className={classes.container}>
              <Typography variant="h6">
                {appointmentConfirmationDescription(scheduleStartDateTime || '')}
              </Typography>

              <Box mt={3} color={GREY_THREE}>
                <Typography variant="h6" component="h5">{APPOINTMENT_CONFIRM_SUBHEADING}</Typography>
              </Box>

            </Box>

            <Box py={3} p={3} bgcolor={GREY_ELEVEN} display="flex" justifyContent="flex-end" flexWrap="wrap">
              <Box mr={2} color={GREY_TWO}>
                <Button type="submit" variant="text" color="inherit" className="muted"
                  onClick={() => handleCancelAppointment()}
                >{CANCEL_APPOINTMENT_TEXT}</Button>
              </Box>

              <Button type="submit" variant="contained" color="primary" disabled={!!!patientId}>
                <Link to={`${PATIENT_INFORMATION_ROUTE}/${patientId}`}>
                  {/* <Link to={PATIENT_APPOINTMENT_SUCCESS}> */}
                  <Box color={WHITE}>
                    {CONTINUE_TEXT}
                  </Box>
                </Link>
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      <ConfirmationModal
        title={APPOINTMENT}
        isOpen={openDelete}
        isLoading={cancelAppointmentLoading}
        description={DELETE_APPOINTMENT_DESCRIPTION}
        handleDelete={removeAppointment}
        setOpen={(open: boolean) => dispatch({
          type: ActionType.SET_OPEN_DELETE, openDelete: open
        })}
      />
    </Box>
  );
};

export default AppointmentConfirmationComponent;
