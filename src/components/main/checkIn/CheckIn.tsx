//packages import
import { FC, useContext } from "react";
import { ChevronRight } from "@material-ui/icons";
import { Box, Button, Card, colors, Grid, Typography } from "@material-ui/core";
//constants, interfaces, utils, types
import { CheckInComponentProps } from "../../../interfacesTypes";
import {
  APPOINTMENT_INFO, APPOINTMENT_TYPE, CHECK_IN, CHECK_IN_AT_TEXT, FACILITY_LOCATION, N_A, PRIMARY_INSURANCE,
  PROVIDER_NAME, REASON, SELF_CHECK_IN
} from "../../../constants";
import { AuthContext } from "../../../context";
import { isBiller } from "../../../utils";

const CheckIn: FC<CheckInComponentProps> = ({ appointmentState, handleStep }) => {
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const isBillerUser = isBiller(roles);
  
  const { appointment, primaryInsurance } = appointmentState;
  const { appointmentType, provider, facility, reason, checkedInAt, selfCheckIn } = appointment ?? {}
  const { firstName, lastName } = provider ?? {}
  const { name: facilityName } = facility ?? {}
  const { name: serviceName } = appointmentType ?? {}

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : N_A

  return (
    <Card>
      <Box p={2} display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center"
        borderBottom={`1px solid ${colors.grey[300]}`}
      >
        <Typography variant="h4">{APPOINTMENT_INFO}</Typography>

        <Button variant="contained" color="primary" onClick={() => isBillerUser ? handleStep(4): handleStep(1)}>
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
              <Typography variant="body2">{CHECK_IN_AT_TEXT}</Typography>
              <Box p={0.2} />
              <Typography variant="body1">{checkedInAt || N_A}</Typography>
            </Box>
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <Box my={2}>
              <Typography variant="body2">{SELF_CHECK_IN}</Typography>
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
