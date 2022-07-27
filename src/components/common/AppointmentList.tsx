// packages block
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// components block
import Alert from "./Alert";
// interfaces, constants, utils blocks
import history from "../../history";
import { WHITE_FOUR } from "../../theme";
import { AppointmentListProps, ParamsType } from "../../interfacesTypes";
import { AppointmentCreateType, AppointmentStatus, useUpdateAppointmentMutation } from "../../generated/graphql"
import { convertDateFromUnix, getAppointmentDateTime, getStandardTimeDuration } from "../../utils";
import {
  RE_SCHEDULE, CHECK_IN, APPOINTMENTS_ROUTE, SCHEDULE_WITH_DOCTOR, SCHEDULED_IN_FACILITY,
  CHECK_IN_ROUTE, MINUTES, TELEHEALTH_URL, TELEHEALTH_TEXT
} from "../../constants";

const AppointmentList: FC<AppointmentListProps> = ({ appointments, type }) => {
  const { id: patientId } = useParams<ParamsType>();

  const [updateAppointment, { loading: updateAppointmentLoading }] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },
  });

  const handlePatientCheckIn = async (id: string) => {
    const { data } = await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id, status: AppointmentStatus.Arrived,
          checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a')
        }
      }
    })

    const { updateAppointment: updateAppointmentResponse } = data ?? {}
    const { response } = updateAppointmentResponse ?? {}
    if (response) {
      const { status } = response

      if (status && status === 200) {
        history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)
      }
    }
  }

  return (
    <Box>
      {appointments?.map(appointment => {
        const { id, scheduleStartDateTime, scheduleEndDateTime, appointmentType, provider, facility, appointmentCreateType } = appointment || {};
        const { firstName, lastName } = provider || {};
        const { name: facilityName } = facility || {};
        const { name: serviceName } = appointmentType || {};

        return (
          <Box
            display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap"
            p={3} mb={3} border={`1px solid ${WHITE_FOUR}`} borderRadius={8} key={id}
          >
            <Box>
              <Typography variant="h6">{getAppointmentDateTime(scheduleStartDateTime || '')}</Typography>
              <Box p={0.5} />
              <Typography variant="body1">
                {serviceName}   ({getStandardTimeDuration(scheduleStartDateTime || '', scheduleEndDateTime || '')} {MINUTES})
              </Typography>

              {provider &&
                <Typography variant="body1">{SCHEDULE_WITH_DOCTOR} {firstName} {lastName}</Typography>}

              {!provider && facility &&
                <Typography variant="body1">{SCHEDULED_IN_FACILITY} {facilityName}</Typography>}
            </Box>

            {type === AppointmentStatus.Scheduled &&
              <Box display="flex" my={2} className="appointment-action-btn">
                <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                  <Button type="submit" variant="outlined" color="default">{RE_SCHEDULE}</Button>
                </Link>

                <Box p={1} />
                {appointmentCreateType === AppointmentCreateType.Telehealth
                  ? <Button type="submit" variant="contained" color="secondary"
                    onClick={() => window.open(TELEHEALTH_URL)}
                    disabled={updateAppointmentLoading}
                  >
                    {TELEHEALTH_TEXT}
                  </Button>

                  : <Button type="submit" variant="contained" color="secondary"
                    onClick={() => handlePatientCheckIn(id || '')}
                    disabled={updateAppointmentLoading}
                  >
                    {CHECK_IN}
                  </Button>}
              </Box>
            }
          </Box>
        )
      })}
    </Box>
  )
}

export default AppointmentList;
