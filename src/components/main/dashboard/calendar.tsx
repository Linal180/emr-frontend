// packages block
import { useEffect, useCallback, Reducer, useState, useReducer } from "react";
import { Box, Card } from "@material-ui/core";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, DayView, WeekView,
  AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentCard";
// context, constants block
import { mapAppointmentData } from "../../../utils"
import { useFindAllAppointmentsLazyQuery, AppointmentsPayload } from "../../../generated/graphql";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../reducers/appointmentReducer";

const CalendarComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [{ appointments }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const [findAllAppointments] = useFindAllAppointmentsLazyQuery({
    variables: {
      appointmentInput: {
        paginationOptions: {
          page: 1, limit: 20
        }
      }
    },

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
        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const handleDateChange = () => setCurrentDate(currentDate)

  const Appointment = ({ children, style, ...restProps }: any) => {
    const { data: { color } } = restProps

    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: color,
          borderRadius: '8px',
          whiteSpace: 'normal !important',
          minHeight: 24,
        }}
      >
        {children}
      </Appointments.Appointment>
    )
  };

  const fetchAppointments = useCallback(async () => {
    await findAllAppointments();
  }, [findAllAppointments]);

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments]);

  return (
    <Card>
      <Box>
        <Scheduler data={mapAppointmentData(appointments)}>
          <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
          <MonthView />
          <WeekView />
          <DayView />
          <Toolbar />
          <TodayButton />
          <ViewSwitcher />
          <DateNavigator />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip showCloseButton layoutComponent={AppointmentCard} />
        </Scheduler>
      </Box>
    </Card>
  )
};

export default CalendarComponent;
