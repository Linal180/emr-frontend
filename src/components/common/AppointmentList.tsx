// packages block
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
import Alert from "./Alert";
// interfaces, constants, utils blocks
import history from "../../history";
import { WHITE_FOUR } from "../../theme";
import { convertDateFromUnix, getAppointmentDateTime } from "../../utils";
import { AppointmentStatus, useUpdateAppointmentMutation } from "../../generated/graphql"
import { AppointmentListProps, ParamsType } from "../../interfacesTypes";
import {
  RE_SCHEDULE, CHECK_IN, APPOINTMENTS_ROUTE, SCHEDULE_WITH_DOCTOR, SCHEDULED_IN_FACILITY, 
  APPOINTMENT_UPDATED_SUCCESSFULLY, CHECK_IN_ROUTE
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
      variables: { updateAppointmentInput: { id, status: AppointmentStatus.CheckedIn, checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a') } }
    })

    const { updateAppointment: updateAppointmentResponse } = data ?? {}
    const { response } = updateAppointmentResponse ?? {}
    if (response) {
      const { status } = response

      if (status && status === 200) {
        Alert.success(APPOINTMENT_UPDATED_SUCCESSFULLY);
        history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)
      }
    }
  }

  return (
    <Box>
      {appointments?.map(appointment => {
        const { id, scheduleStartDateTime, appointmentType, provider, facility } = appointment || {};
        const { firstName, lastName } = provider || {};
        const { name: facilityName } = facility || {};
        const { duration, name: serviceName } = appointmentType || {};

        return (
          <Box
            display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap"
            p={3} mb={3} border={`1px solid ${WHITE_FOUR}`} borderRadius={8} key={id}
          >
            <Box>
              <Typography variant="h6">{getAppointmentDateTime(scheduleStartDateTime || '')}</Typography>
              <Box p={0.5} />
              <Typography variant="body1">{serviceName} ({duration} Minutes)</Typography>

              {provider &&
                <Typography variant="body1">{SCHEDULE_WITH_DOCTOR} {firstName} {lastName}</Typography>}

              {!provider && facility &&
                <Typography variant="body1">{SCHEDULED_IN_FACILITY} {facilityName}</Typography>}
            </Box>

            {type === AppointmentStatus.Initiated &&
              <Box display="flex" my={2}>
                <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                  <Button type="submit" variant="outlined" color="default">{RE_SCHEDULE}</Button>
                </Link>

                <Box p={1} />
                <Button type="submit" variant="contained" color="secondary" onClick={() => handlePatientCheckIn(id || '')} disabled={updateAppointmentLoading}>
                  {CHECK_IN}
                </Button>
              </Box>
            }
          </Box>
        )
      })}
    </Box>
  )
}

export default AppointmentList;
