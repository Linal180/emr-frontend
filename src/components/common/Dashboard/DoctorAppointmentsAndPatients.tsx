// packages block
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Typography } from "@material-ui/core";
import { BLUE, GRAY_SEVEN, GREY_SEVEN, WHITE } from "../../../theme";
// history, constant and styles block
import { NO_RECORDS, PAGE_LIMIT, UPCOMING_APPOINTMENT_LIST } from "../../../constants";
import { AppointmentsPayload, PatientsPayload, useFetchAllPatientLazyQuery, useFindAllDashboardPatientLazyQuery, useFindAllUpcomingAppointmentsLazyQuery } from "../../../generated/graphql";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../../reducers/appointmentReducer";
import {
  Action as PatientAction, ActionType as PatientActionType, initialState as patientInitialState,
  State as PatientState, patientReducer
} from "../../../reducers/patientReducer";
import ViewDataLoader from "../ViewDataLoader";
import { getShortName, getStandardTime } from "../../../utils";
import { NoDataIcon } from "../../../assets/svgs";
import Avatar from "../Avatar";

interface DoctorAppointmentsAndPatientsProps {
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  isAppointment?: boolean;
}

const DoctorAppointmentsAndPatients: FC<DoctorAppointmentsAndPatientsProps> = ({
  isAppointment, patientId, facilityId, providerId
}): JSX.Element => {
  const [{ appointments }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const [{ patients }, patientDispatch] =
    useReducer<Reducer<PatientState, PatientAction>>(patientReducer, patientInitialState)

  const [findAllAppointments, { loading }] = useFindAllUpcomingAppointmentsLazyQuery({
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
          appointments: appointments as AppointmentsPayload['appointments']
        });
      } else {
        dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
      }
    }
  });

  const [fetchAllPatientsQuery, { loading: patientLoading }] = useFindAllDashboardPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      patientDispatch({ type: PatientActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { findAllPatient } = data || {};

      if (findAllPatient) {
        const { patients } = findAllPatient
        patients && patientDispatch({
          type: PatientActionType.SET_PATIENTS,
          patients: patients as PatientsPayload['patients']
        })
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: PAGE_LIMIT } }

      providerId && await fetchAllPatientsQuery({
        variables: {
          patientInput: { ...pageInputs, doctorId: providerId }
        }
      })
    } catch (error) { }
  }, [fetchAllPatientsQuery, providerId])

  const fetchAppointments = useCallback(async () => {
    const query = patientId ? { patientId } : { providerId }

    await findAllAppointments({
      variables: { upComingAppointmentsInput: { ...query } }
    })
  }, [findAllAppointments, patientId, providerId])

  useEffect(() => {
    isAppointment ?
      fetchAppointments()
      : fetchAllPatients()
  }, [fetchAllPatients, fetchAppointments, isAppointment])

  return (
    <>
      {loading ?
        <ViewDataLoader columns={12} rows={3} /> :
        <>
          {!!appointments && appointments.length > 0 ? (
            appointments.map((appointment) => {
              const { scheduleStartDateTime, appointmentType, patient } = appointment || {}
              const { id, firstName, lastName } = patient || {}
              const { name } = appointmentType || {}


              return (
                <Box mb={3} display='flex' justifyContent='space-between' alignItems='start'>
                  <Box display='flex'>
                    <Avatar id={id || ''} name={`${firstName} ${lastName}`} />
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
