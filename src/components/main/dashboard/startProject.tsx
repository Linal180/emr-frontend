// packages block
import { Reducer, useEffect, useReducer, useState } from "react";
import { Box, Card } from "@material-ui/core";
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator,
  DayView, WeekView, AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentCard";
// styles, constants  block
import { PAGE_LIMIT } from "../../../constants";
import { mapAppointmentData } from "../../../utils"
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../reducers/appointmentReducer";
import { AppointmentsPayload, useFindAllAppointmentsLazyQuery } from "../../../generated/graphql";
import Backdrop from "../../common/Backdrop";
import { useCalendarStyles } from "../../../styles/calendarStyles";


const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, searchQuery, appointments, appointmentColor } = state;

  // const props = {
  //   color: appointmentColor
  // }

  const classes = useCalendarStyles()

  const [findAllAppointments, { loading: appointmentsLoading }] = useFindAllAppointmentsLazyQuery({
    variables: {
      appointmentInput: {
        paginationOptions: {
          page, limit: PAGE_LIMIT
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
        const { appointments, pagination } = findAllAppointments

        if (!searchQuery && pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
          dispatch({
            type: ActionType.SET_APPOINTMENTS,
            appointments: appointments as AppointmentsPayload['appointments']
          });
        }
      }
    }
  });

  useEffect(() => {
    findAllAppointments();
  }, [findAllAppointments]);

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  const asd = appointments?.map((item) => {
    const color = item?.appointmentType?.color;

    return (
      { color }
    )
  })

  console.log(asd);
  console.log(appointments);


  return (
    <Card>
      {appointmentsLoading ? <Backdrop loading={true} /> :
        <Box className={classes.calendrAppointments}>
          <Scheduler data={mapAppointmentData(appointments)} height={800} >
            <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
            <MonthView />
            <WeekView />
            <DayView />
            <Toolbar />
            <TodayButton />
            <ViewSwitcher />
            <DateNavigator />
            <Appointments />
            <AppointmentTooltip showCloseButton layoutComponent={AppointmentCard} />
          </Scheduler>
        </Box>
      }
    </Card>
  )
};

export default StartProjectComponent;
