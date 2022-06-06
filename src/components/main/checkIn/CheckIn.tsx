//packages import
import { Box, Button, Card, colors, Grid, Typography } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import { FC } from "react";
//constants, interfaces, utils, types
import { APPOINTMENT_INFO, APPOINTMENT_TYPE, CHECK_IN, FACILITY_LOCATION, N_A, PRIMARY_INSURANCE, PROVIDER_NAME, REASON } from "../../../constants";
import { CheckInComponentProps } from "../../../interfacesTypes";

const CheckIn: FC<CheckInComponentProps> = ({appointmentState, appointmentDispatcher, handleStep}) => {
  const { appointment, primaryInsurance } = appointmentState;
  const { appointmentType, provider, facility, reason, checkedInAt, selfCheckIn } = appointment ?? {}
  const { firstName, lastName } = provider ?? {}
  const { name: facilityName } = facility ?? {}
  const { name: serviceName } = appointmentType ?? {}

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : N_A

  return (
    <Card>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center"
        borderBottom={`1px solid ${colors.grey[300]}`}
      >
        <Typography variant="h4">{APPOINTMENT_INFO}</Typography>

        <Button variant="contained" color="primary" onClick={() => handleStep(1)}>
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
              <Typography variant="body1">{serviceName}</Typography>
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
  )
}

export default CheckIn;
