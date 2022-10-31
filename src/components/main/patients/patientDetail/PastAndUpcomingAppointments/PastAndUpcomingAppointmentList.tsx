// packages block
import { Box, Button, Typography } from "@material-ui/core";
import { FC, useState } from "react";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
// common block
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
// interfaces, constants, utils blocks
import {
  APPOINTMENT, APPOINTMENTS_ROUTE, CANCELLED, CANCEL_APPOINTMENT_DESCRIPTION,
  CANCEL_APPOINTMENT_TEXT,
  CANT_CANCELLED_APPOINTMENT, CHECKED_IN_SUCCESSFULLY, CHECK_IN, CHECK_IN_ROUTE, PATIENT_CANCELLED_APPOINTMENT,
  RE_SCHEDULE, SCHEDULED_IN_FACILITY, SCHEDULE_WITH_DOCTOR, SOMETHING_WENT_WRONG, VIEW_ENCOUNTER
} from "../../../../../constants";
import { AppointmentCreateType, AppointmentStatus, useCancelAppointmentMutation, useUpdateAppointmentMutation } from "../../../../../generated/graphql";
import history from "../../../../../history";
import { ParamsType, PastAndUpcomingAppointmentListProps } from "../../../../../interfacesTypes";
import { WHITE_FOUR } from "../../../../../theme";
import { canCancelAppointment, convertDateFromUnix, getAppointmentDateTime } from "../../../../../utils";

const PastAndUpcomingAppointmentList: FC<PastAndUpcomingAppointmentListProps> = ({ appointments, reload, past }) => {
  const { id: patientId } = useParams<ParamsType>()
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
          setAppToken('')
        }
      }
    }
  });

  const [updateAppointment] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(CHECKED_IN_SUCCESSFULLY);
          reload && reload()
        }
      }
    }
  });

  const handleCancelAppointment = async () => {
    appToken ? await cancelAppointment({
      variables: {
        cancelAppointment: { reason: PATIENT_CANCELLED_APPOINTMENT, token: appToken }
      }
    }) : Alert.error(SOMETHING_WENT_WRONG)
  };

  const onDeleteClick = (token: string) => {
    setOpenDelete(true)
    setAppToken(token)
  };

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
    <Box pb={2}>
      {appointments?.map(appointment => {
        const {
          id, scheduleStartDateTime, appointmentType, provider, facility, token, status, appointmentCreateType, checkedInAt
        } = appointment || {};
        const { firstName, lastName } = provider || {};
        const { name: facilityName } = facility || {};

        const { duration, name: serviceName } = appointmentType || {};
        const canBeCancelled = canCancelAppointment(status as AppointmentStatus, scheduleStartDateTime as string)
        const isCancelled = status === AppointmentStatus.Cancelled

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

            {!past &&
              <Box display="flex" flexWrap="wrap" my={2}>
                <Box p={1}>
                  {status === AppointmentStatus.Scheduled &&
                    <Link to={`${APPOINTMENTS_ROUTE}/${id}`}>
                      <Button type="submit" variant="outlined" color="default">{RE_SCHEDULE}</Button>
                    </Link>
                  }
                </Box>

                <Box p={1}>
                  {status === AppointmentStatus.Scheduled && appointmentCreateType !== AppointmentCreateType.Telehealth && !checkedInAt &&
                    <Button
                      type="submit"
                      variant="contained"
                      className="blue-button-New"
                      onClick={() => id && handlePatientCheckIn(id)}
                    >{CHECK_IN}</Button>
                  }

                  {!isCancelled && checkedInAt && <Button
                    type="submit"
                    variant="contained"
                    className="blue-button-New"
                    onClick={() => id && history.push(`${APPOINTMENTS_ROUTE}/${id}/${patientId}${CHECK_IN_ROUTE}`)}
                  >{VIEW_ENCOUNTER}</Button>}
                </Box>

                <Box display="flex" p={1} onClick={() => {
                  !!canBeCancelled ?
                    Alert.info(canBeCancelled) : onDeleteClick(token || '')
                }}>
                  <Button variant="outlined" color="inherit" className="danger" disabled={isCancelled}>
                    {isCancelled ? CANCELLED : CANCEL_APPOINTMENT_TEXT}
                  </Button>
                </Box>
              </Box>
            }
          </Box>
        )
      })}

      <ConfirmationModal
        shouldDisplayCancel={true}
        actionText={"Cancel Appointment"}
        title={APPOINTMENT}
        isOpen={openDelete}
        isLoading={cancelAppointmentLoading}
        description={CANCEL_APPOINTMENT_DESCRIPTION}
        setOpen={(open: boolean) => setOpenDelete(open)}
        handleDelete={handleCancelAppointment}
      />
    </Box>
  )
};

export default PastAndUpcomingAppointmentList;
