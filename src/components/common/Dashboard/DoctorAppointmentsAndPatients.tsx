// packages block
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Typography } from "@material-ui/core";
//components
import Avatar from "../Avatar";
import ViewDataLoader from "../ViewDataLoader";
// history, constant and styles block
import { NoDataIcon } from "../../../assets/svgs";
import { DESC, NO_RECORDS } from "../../../constants";
import { GRAY_SEVEN, GREY_SEVEN } from "../../../theme";
import { getStandardTime, sortingArray, isCurrentDay } from "../../../utils";
import { DoctorAppointmentsAndPatientsProps } from "../../../interfacesTypes";
import {
  Action, ActionType, appointmentReducer, initialState, State
} from "../../../reducers/appointmentReducer";
import {
  AppointmentsPayload, AppointmentStatus, useFindAllDoctorUpcomingAppointmentsLazyQuery
} from "../../../generated/graphql";

const DoctorAppointmentsAndPatients: FC<DoctorAppointmentsAndPatientsProps> = ({
  patientId, providerId, setCount
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


        const todayAppointments = appointments?.filter(appointment =>
          appointment?.status !== AppointmentStatus.Cancelled
          && appointment?.status !== AppointmentStatus.NoShow
          && appointment?.status !== AppointmentStatus.Discharged
          && isCurrentDay(appointment?.scheduleStartDateTime || '')
        )

        setCount && setCount(todayAppointments?.length || 0)
        const sorted = sortingArray<typeof todayAppointments>(todayAppointments,
          'scheduleStartDateTime', DESC) as AppointmentsPayload['appointments']

        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: sorted as AppointmentsPayload['appointments']
        });
      } else {
        dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    const query = patientId ? { patientId } : { providerId }

    await findAllAppointments({
      variables: { upComingAppointmentsInput: { ...query, paginationOptions: { limit: 10, page: 1 } } }
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
              const { id, scheduleStartDateTime, appointmentType, patient } = appointment || {}
              const { firstName, lastName, profileAttachment } = patient || {}
              const { name } = appointmentType || {}

              return (
                <Box key={id} display='flex' justifyContent='space-between' alignItems='start' className="mb-3">
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
            )) : (
            <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>
            </Box>)
          }
        </>
      }
    </>)
};

export default DoctorAppointmentsAndPatients;
