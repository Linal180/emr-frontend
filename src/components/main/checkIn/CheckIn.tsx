//packages import
import { useParams } from "react-router";
import { ChevronRight } from "@material-ui/icons";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Card, colors, Grid, Typography } from "@material-ui/core";
//components
import TableLoader from "../../common/TableLoader";
//constants, interfaces, utils, types
import { isBiller } from "../../../utils";
import { AuthContext } from "../../../context";
import { CheckInComponentProps, ParamsType } from "../../../interfacesTypes";
import {
  APPOINTMENT_INFO, APPOINTMENT_TYPE, CHECK_IN_AT_TEXT, DONE_CHECK_IN, FACILITY_LOCATION, N_A, PRIMARY_INSURANCE,
  PROVIDER_NAME, REASON, SELF_CHECK_IN, SIGN_OFF, START_CHECK_IN, TO_CHECKOUT, TO_EXAM, TO_INTAKE
} from "../../../constants";
import { AppointmentPayload, useGetAppointmentCheckInLazyQuery } from "../../../generated/graphql";

const CheckIn: FC<CheckInComponentProps> = ({ handleStep, activeStep, handleProceed }) => {
  const { appointmentId } = useParams<ParamsType>()
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const isBillerUser = isBiller(roles);

  const [appointment, setAppointment] = useState<AppointmentPayload['appointment']>(undefined)

  const { appointmentType, provider, facility, reason, checkedInAt, selfCheckIn, primaryInsurance } = appointment ?? {}
  const { firstName, lastName } = provider ?? {}
  const { name: facilityName } = facility ?? {}
  const { name: serviceName } = appointmentType ?? {}

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : N_A;

  const [getAppointment, { loading }] = useGetAppointmentCheckInLazyQuery({
    onCompleted: (data) => {
      const { getAppointment } = data || {}
      const { appointment, response } = getAppointment || {}
      const { status } = response || {}

      if (status === 200) {
        appointment && setAppointment(appointment as AppointmentPayload['appointment'])
      } else {
        setAppointment(undefined)
      }
    },
    onError: () => {
      setAppointment(undefined)
    }
  })

  const getProceedBtnTitle = () => {
    if (isBillerUser) {
      return TO_CHECKOUT
    }
    switch (activeStep) {
      case 0:
        return START_CHECK_IN

      case 1:
        return DONE_CHECK_IN

      case 2:
        return TO_INTAKE

      case 3:
        return TO_EXAM

      case 4:
        return SIGN_OFF

      case 5:
        return TO_CHECKOUT

      default:
        return START_CHECK_IN
    }
  }

  const handleNextStep = () => {
    if (activeStep === 0) {
      return isBillerUser ? handleStep(4) : handleStep(0, true)
    }

    if (handleProceed) {
      return handleProceed(true)
    }

    isBillerUser ? handleStep(4) : handleStep(0, true)
  }

  const fetchAppointment = useCallback(async () => {
    try {
      await getAppointment({ variables: { getAppointment: { id: appointmentId || '' } } })
    } catch (e) { }
  }, [getAppointment, appointmentId])

  useEffect(() => {
    appointmentId && fetchAppointment()
  }, [fetchAppointment, appointmentId])


  return (
    <>
      <Card>
        <Box p={2} display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center"
          borderBottom={`1px solid ${colors.grey[300]}`}
        >
          <Typography variant="h4">{APPOINTMENT_INFO}</Typography>

          <Button
            variant="contained" color="primary"
            endIcon={<Box width={20}><ChevronRight /></Box>}
            onClick={() => handleNextStep()}>
            {getProceedBtnTitle()}
          </Button>
        </Box>
        {loading ? <TableLoader numberOfColumns={2} numberOfRows={6} /> :
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
          </Box>}
      </Card>

      <Box p={2} />

    </>
  )
}

export default CheckIn;
