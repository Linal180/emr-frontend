// packages block
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// common block
import Alert from "./Alert";
import ConfirmationModal from "./ConfirmationModal";
// interfaces, constants, utils blocks
import { WHITE_FOUR } from "../../theme";
import { getAppointmentDateTime, getISOTime } from "../../utils";
import { AppointmentListProps } from "../../interfacesTypes";
import { Appointmentstatus, useCancelAppointmentMutation } from "../../generated/graphql"
import {
  RE_SCHEDULE, CHECK_IN, APPOINTMENTS_ROUTE, PATIENT_CANCELLED_APPOINTMENT, CANCEL_APPOINTMENT, CANT_CANCELLED_APPOINTMENT,
  DELETE_APPOINTMENT_DESCRIPTION, APPOINTMENT_DETAILS, CANCEL_TIME_EXPIRED_MESSAGE, SCHEDULE_WITH_DOCTOR, SCHEDULED_IN_FACILITY
} from "../../constants";
import moment from "moment";

const AppointmentList: FC<AppointmentListProps> = ({ appointments, type, reload }) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [appToken, setAppToken] = useState<string>('');

  const [cancelAppointment, { loading: cancelAppointmentLoading }] = useCancelAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      setOpenDelete(false)
    },

    async onCompleted(data) {
      if (data) {
        const { cancelAppointment: { response } } = data

        if (response) {
          const { message } = response
          reload && reload();
          message && Alert.success(message);
          setOpenDelete(false)
        }
      }
    }
  });

  const handleCancelAppointment = async () => {
    appToken && await cancelAppointment({
      variables: {
        cancelAppointment: { reason: PATIENT_CANCELLED_APPOINTMENT, token: appToken }
      }
    })
  };

  const onDeleteClick = (token: string) => {
    setOpenDelete(true)
    setAppToken(token)
  };

  return (
    <Box>
      {appointments?.map(appointment => {
        const { id, scheduleStartDateTime, appointmentType, provider, facility, token } = appointment || {};
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

              {provider && <Typography variant="body1">{SCHEDULE_WITH_DOCTOR} {firstName} {lastName}</Typography>}

              {!provider && facility && <Typography variant="body1">{SCHEDULED_IN_FACILITY} {facilityName}</Typography>}
            </Box>

            {type === Appointmentstatus.Initiated &&
              <Box display="flex" my={2}>
                <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                  <Button type="submit" variant="outlined" color="default">{RE_SCHEDULE}</Button>
                </Link>

                <Box p={1} />

                <Button type="submit" variant="contained" className="blue-button-New">{CHECK_IN}</Button>
                <Box display="flex" pl={2} onClick={() => {
                  moment(getISOTime(scheduleStartDateTime || '')).diff(moment(), 'hours') <= 1 ?
                    Alert.info(CANCEL_TIME_EXPIRED_MESSAGE) : onDeleteClick(token || '')
                }}>
                  <Button variant="contained" color="secondary">{CANCEL_APPOINTMENT}</Button>
                </Box>
              </Box>
            }
          </Box>
        )
      })}

      <ConfirmationModal
        title={APPOINTMENT_DETAILS}
        isOpen={openDelete}
        isLoading={cancelAppointmentLoading}
        description={DELETE_APPOINTMENT_DESCRIPTION}
        setOpen={(open: boolean) => setOpenDelete(open)}
        handleDelete={handleCancelAppointment}
      />
    </Box>
  )
};

export default AppointmentList;
