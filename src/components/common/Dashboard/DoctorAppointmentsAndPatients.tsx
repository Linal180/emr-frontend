// packages block
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Typography } from "@material-ui/core";
//components
import Avatar from "../Avatar";
import ViewDataLoader from "../ViewDataLoader";
// history, constant and styles block
import { NO_RECORDS } from "../../../constants";
import { getStandardTime } from "../../../utils";
import { NoDataIcon } from "../../../assets/svgs";
import { GRAY_SEVEN, GREY_SEVEN } from "../../../theme";
import { AppointmentsPayload, AppointmentStatus, useFindAllDoctorUpcomingAppointmentsLazyQuery } from "../../../generated/graphql";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../../reducers/appointmentReducer";

interface DoctorAppointmentsAndPatientsProps {
  patientId?: string;
  providerId?: string;
}

const DoctorAppointmentsAndPatients: FC<DoctorAppointmentsAndPatientsProps> = ({
  patientId, providerId
}): JSX.Element => {
  const [{ appointments }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const [findAllAppointments, { loading }] = useFindAllDoctorUpcomingAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
    },

    onCompleted(data) {
      const { findAllUpcomingAppointments } = data || {};

      if (findAllUpcomingAppointments) {
        const { appointments } = findAllUpcomingAppointments

        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: appointments?.filter(appointment =>
            appointment?.status !== AppointmentStatus.Cancelled) as AppointmentsPayload['appointments']
        });
      } else {
        dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    const query = patientId ? { patientId } : { providerId }

    await findAllAppointments({
      variables: { upComingAppointmentsInput: { ...query } }
    })
  }, [findAllAppointments, patientId, providerId])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return (
    <>
      {loading ?
        <ViewDataLoader columns={12} rows={3} /> :
        <>
          {!!appointments && appointments.length > 0 ? (
            appointments.map((appointment) => {
              const { scheduleStartDateTime, appointmentType, patient } = appointment || {}
              const { firstName, lastName, profileAttachment } = patient || {}
              const { name } = appointmentType || {}


              return (
                <Box mb={3} display='flex' justifyContent='space-between' alignItems='start'>
                  <Box display='flex'>
                    <Avatar id={profileAttachment || ''} name={`${firstName} ${lastName}`} />
                    <Box>
                      <Box>
                        <Typography variant="body1">{firstName} {lastName}</Typography>
                      </Box>

                      <Box color={GRAY_SEVEN}>
                        <Typography variant="body1">{name}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box color={GRAY_SEVEN} fontWeight={700}>
                    <Typography variant="inherit">{getStandardTime(scheduleStartDateTime || '')}</Typography>
                  </Box>
                </Box>
              )
            }
            )) : (<Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>
            </Box>)
          }
        </>
      }
    </>)
};

export default DoctorAppointmentsAndPatients;
