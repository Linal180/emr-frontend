// packages block
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
import { Box, Typography } from "@material-ui/core";
//components
import Avatar from "../Avatar";
import ViewDataLoader from "../ViewDataLoader";
// history, constant and styles block
import { NoDataIcon } from "../../../assets/svgs";
import { DESC, NO_RECORDS } from "../../../constants";
import { GRAY_SEVEN, GREY_SEVEN } from "../../../theme";
import { getStandardTime, sortingArray, isCurrentDay, isSuperAdmin, isPracticeAdmin, isOnlyDoctor } from "../../../utils";
import { DoctorAppointmentsAndPatientsProps } from "../../../interfacesTypes";
import {
  Action, ActionType, appointmentReducer, initialState, State
} from "../../../reducers/appointmentReducer";
import {
  AppointmentsPayload, AppointmentStatus, useFindAllAppointmentsLazyQuery
} from "../../../generated/graphql";
import moment from "moment";
import { AuthContext } from "../../../context";

const DoctorAppointmentsAndPatients: FC<DoctorAppointmentsAndPatientsProps> = ({
  patientId, providerId, setCount
}): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId, practice } = facility || {}
  const { id: practiceId } = practice || {}
  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);
  const isDoctor = isOnlyDoctor(roles)
  const [{ appointments }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const [findAllAppointments, { loading }] = useFindAllAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { appointments } = findAllAppointments


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
    const pageInputs = { paginationOptions: { page: 1, limit: 10 } }
    const inputs = isSuper
      ? {}
      : isPracticeUser
        ? { practiceId, facilityId: facilityId }
        : isDoctor
          ? { providerId }
          : { facilityId }

    const query = patientId ? { patientId } : { providerId }

    await findAllAppointments({
      variables: { appointmentInput: { ...inputs, ...query, ...pageInputs, appointmentDate: moment().format('YYYY-MM-DD') } }
    })
  }, [facilityId, findAllAppointments, isDoctor, isPracticeUser, isSuper, patientId, practiceId, providerId])

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
