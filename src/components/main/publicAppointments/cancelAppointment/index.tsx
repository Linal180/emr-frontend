// packages block
import { FC, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Card, Typography } from '@material-ui/core';
// components block
import Alert from "../../../common/Alert";
// utils, styles  block, constants
import { WHITE_TWO } from '../../../../theme';
import { ParamsType } from "../../../../interfacesTypes";
import { useCancelAppointmentMutation } from "../../../../generated/graphql";
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles"
import {
  APPOINTMENT_CANCEL, APPOINTMENT_NOT_EXIST, CANT_CANCELLED_APPOINTMENT, NOT_FOUND_EXCEPTION,
  PATIENT_CANCELLED_APPOINTMENT, TOKEN_NOT_FOUND
} from "../../../../constants";

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
        }
      }
    }
  });


  useEffect(() => {
    if (id) {
      cancelAppointment({
        variables: { cancelAppointment: { token: id, reason: PATIENT_CANCELLED_APPOINTMENT } }
      })
    } else {
      Alert.error(TOKEN_NOT_FOUND)
    }
  }, [cancelAppointment, id])

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <Box minHeight="580px" className={classes.container}>
          <Box maxWidth="700px">
            <Typography component="h3" variant="h3">{APPOINTMENT_CANCEL}</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CancelAppointmentComponent;
