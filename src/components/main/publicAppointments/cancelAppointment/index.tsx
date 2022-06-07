// packages block
import { FC } from "react";
import { useParams } from "react-router";
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
// components block
import Alert from "../../../common/Alert";
// utils, styles  block, constants
import { GREY_ELEVEN, GREY_THREE, GREY_TWO, WHITE_TWO } from '../../../../theme';
import { ParamsType } from "../../../../interfacesTypes";
import { useCancelAppointmentMutation } from "../../../../generated/graphql";
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles"
import {
  appointmentCancellationDescription, APPOINTMENT_CANCEL_SUBHEADING, APPOINTMENT_NOT_EXIST,
  CANCEL_APPOINTMENT_TEXT, CANT_CANCELLED_APPOINTMENT, DISMISS, LOGIN_ROUTE, NOT_FOUND_EXCEPTION,
  PATIENT_CANCELLED_APPOINTMENT, YES_CANCEL,
} from "../../../../constants";
import history from "../../../../history";

const CancelAppointmentComponent: FC = (): JSX.Element => {
  const classes = confirmationStyles();
  const { id } = useParams<ParamsType>();

  const [cancelAppointment,] = useCancelAppointmentMutation({
    onError({ message }) {
      Alert.error(message === NOT_FOUND_EXCEPTION ? APPOINTMENT_NOT_EXIST : CANT_CANCELLED_APPOINTMENT)
    },

    onCompleted(data) {
      if (data) {
        const { cancelAppointment: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          history.push(LOGIN_ROUTE)
        }
      }
    }
  });

  const cancelAppointmentHandler = async () => {
    if (id) {
      await cancelAppointment({
        variables: { cancelAppointment: { token: id, reason: PATIENT_CANCELLED_APPOINTMENT } }
      })
    }
  };

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4"><strong>{CANCEL_APPOINTMENT_TEXT}</strong></Typography>
        </Box>

        <Box className={classes.container}>
          <Typography variant="h6">{appointmentCancellationDescription}</Typography>

          <Box mt={3} color={GREY_THREE}>
            <Typography variant="h6" component="h5">{APPOINTMENT_CANCEL_SUBHEADING}</Typography>
          </Box>

        </Box>

        <Box py={3} p={3} bgcolor={GREY_ELEVEN} display="flex" justifyContent="flex-end" flexWrap="wrap">
          <Box mr={2} color={GREY_TWO}>
            <Button href={LOGIN_ROUTE} variant="text" color="inherit" className="muted">{DISMISS}</Button>
          </Box>

          <Button type="submit" variant="text" color="inherit" className="danger" onClick={cancelAppointmentHandler}>{YES_CANCEL}</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CancelAppointmentComponent;
