// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Card, Typography } from '@material-ui/core';
// components block
import Alert from "../../../../../components/common/Alert";
// components block
import Backdrop from "../../../../../components/common/Backdrop";
// utils, styles  block, constants
import history from "../../../../../history";
import { WHITE_TWO } from '../../../../../theme';
import { ParamsType } from "../../../../../interfacesTypes";
import { getFormattedDate, getStandardTime } from "../../../../../utils";
import { useGetAppointmentLazyQuery } from "../../../../../generated/graphql";
import { slotConfirmationStyles } from "../../../../../styles/publicAppointment/slotConfirmation";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import {
  APPOINTMENT_NOT_FOUND, SLOT_CONFIRMATION_SUB_HEADING_TWO, PATIENT_APPOINTMENT_FAIL,
  PATIENT_INFORMATION, SLOT_CONFIRMATION_HEADING_TWO, SLOT_CONFIRMATION_SUB_HEADING,
} from '../../../../../constants';

const SlotConfirmation: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = slotConfirmationStyles();
  const [{ appointment }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      Alert.error(APPOINTMENT_NOT_FOUND)
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          dispatch({ type: ActionType.SET_APPOINTMENT, appointment })
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

  const { scheduleStartDateTime } = appointment || {}

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {getAppointmentLoading ? <Backdrop loading={true} /> : (
        <Card>
          <Box minHeight="580px" className={classes.container}>
            <Box maxWidth="700px">
              <Typography component="h3" variant="h3" >Thank you! Your visit at {getStandardTime(scheduleStartDateTime || '')} on {getFormattedDate(scheduleStartDateTime || '')} has been confirmed.</Typography>
              <Typography component="h3" variant="h3" >{SLOT_CONFIRMATION_HEADING_TWO}</Typography>
            </Box>

            <Box pt={3}>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING}</Typography>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING_TWO}</Typography>
            </Box>

            <Box display="flex" gridGap={20} mt={3}>
              <Button type="submit" variant="contained">
                Cancel Booking
              </Button>
              <Button type="submit" variant="contained" className='blue-button'>
                <Link to={PATIENT_INFORMATION} >
                  <Typography>
                    Continue
                  </Typography>
                </Link>
              </Button>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SlotConfirmation;
