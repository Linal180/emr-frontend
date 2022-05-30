//packages import
import { Box, Button, Card, colors, Grid, Typography } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import { FC, useCallback, useEffect } from "react";
import { useParams } from "react-router";
//constants, interfaces, utils, types
import { APPOINTMENT_INFO, APPOINTMENT_TYPE, CHECK_IN, FACILITY_LOCATION, N_A, PRIMARY_INSURANCE, PROVIDER_NAME, REASON } from "../../../constants";
import { AppointmentPayload, useGetAppointmentLazyQuery } from "../../../generated/graphql";
import { CheckInComponentProps, ParamsType } from "../../../interfacesTypes";
import { ActionType,} from "../../../reducers/appointmentReducer";
import Alert from "../../common/Alert";

const CheckIn: FC<CheckInComponentProps> = ({appointmentState, appointmentDispatcher, handleStep}) => {
  const { appointmentId } = useParams<ParamsType>()
  const { appointment } = appointmentState;
  const { appointmentType, provider, primaryInsurance, facility, reason, checkedInAt, selfCheckIn } = appointment ?? {}
  const { name: facilityName } = facility ?? {}
  const { serviceType } = appointmentType ?? {}
  const { firstName, lastName } = provider ?? {}
  
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : N_A

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

          appointmentDispatcher({ type: ActionType.SET_APPOINTMENT, appointment: appointment as AppointmentPayload['appointment'] })
        }
      }
    },
  });

  const fetchAppointment = useCallback(async () => {
    appointmentId && await getAppointment({
      variables: { getAppointment: { id: appointmentId?.toString() ?? '' } },
    });
  }, [getAppointment, appointmentId]);

  useEffect(() => {
    appointmentId && fetchAppointment()
  }, [appointmentId, fetchAppointment]);

  return (
    <>
    <Card>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant="h4">{APPOINTMENT_INFO}</Typography>

        <Button variant="contained" color="primary" onClick={handleStep(1)}>
          {CHECK_IN}
          <ChevronRight />
        </Button>
      </Box>

      <Box p={2}>
        <Grid container spacing={0}>
            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">{APPOINTMENT_TYPE}</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{serviceType}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">{FACILITY_LOCATION}</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{facilityName}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">{PROVIDER_NAME}</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{fullName}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">{REASON}</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{reason}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">Checked in at</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{checkedInAt || N_A}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">Self Check in</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{selfCheckIn ? 'Yes' : 'No' ?? N_A}</Typography>
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box my={2}>
                <Typography variant="body2">{PRIMARY_INSURANCE}</Typography>
                <Box p={0.2} />
                <Typography variant="body1">{primaryInsurance || N_A}</Typography>
              </Box>
            </Grid>
        </Grid>
      </Box>
    </Card>
  </>
  )
}

export default CheckIn