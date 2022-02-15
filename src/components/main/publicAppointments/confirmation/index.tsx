// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Card, Typography } from '@material-ui/core';
// components block
import Alert from "../../../../components/common/Alert";
import Backdrop from "../../../../components/common/Backdrop";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
// utils, styles  block, constants
import history from "../../../../history";
import { WHITE_TWO } from '../../../../theme';
import { ParamsType } from "../../../../interfacesTypes";
import { getFormattedDate, getStandardTime } from "../../../../utils";
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles";
import {
  Appointmentstatus, useCancelAppointmentMutation, useGetAppointmentLazyQuery
} from "../../../../generated/graphql";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../reducers/appointmentReducer";
import {
  APPOINTMENT_NOT_FOUND, SLOT_CONFIRMATION_SUB_HEADING_TWO, PATIENT_APPOINTMENT_FAIL,
  PATIENT_INFORMATION, SLOT_CONFIRMATION_HEADING_TWO, SLOT_CONFIRMATION_SUB_HEADING,
  APPOINTMENT, DELETE_APPOINTMENT_DESCRIPTION, CANT_CANCELLED_APPOINTMENT, TOKEN_NOT_FOUND,
  PATIENT_CANCELLED_APPOINTMENT, PATIENT_APPOINTMENT_CANCEL,
} from '../../../../constants';

const AppointmentConfirmationComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = confirmationStyles();
  const [{ appointment, openDelete }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
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

            if (status === Appointmentstatus.Cancelled) {
              history.push(PATIENT_APPOINTMENT_CANCEL)
            }

            dispatch({ type: ActionType.SET_APPOINTMENT, appointment })
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
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {(getAppointmentLoading || !appointment) ? <Backdrop loading={true} /> : (
        <Card>
          <Box minHeight="580px" className={classes.container}>
            <Box maxWidth="700px">
              <Typography component="h3" variant="h3">
                Thank you! Your visit at {getStandardTime(scheduleStartDateTime || '')} on {getFormattedDate(scheduleStartDateTime || '')} has been confirmed.
              </Typography>

              <Typography component="h3" variant="h3">{SLOT_CONFIRMATION_HEADING_TWO}</Typography>
            </Box>

            <Box pt={3}>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING}</Typography>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING_TWO}</Typography>
            </Box>

            <Box display="flex" gridGap={20} mt={3}>
              <Button type="submit" variant="contained" onClick={() => handleCancelAppointment()}>
                Cancel Booking
              </Button>

              <Button type="submit" variant="contained" className='blue-button' disabled={!!!patientId}>
                <Link to={`${PATIENT_INFORMATION}/${patientId}`}>
                  <Typography>
                    Continue
                  </Typography>
                </Link>
              </Button>
            </Box>
          </Box>
        </Card>
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
