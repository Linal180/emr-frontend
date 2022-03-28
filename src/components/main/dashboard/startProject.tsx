// packages block
import { Box, Card } from "@material-ui/core";
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Reducer, useEffect, useReducer, useState } from "react";
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator,
  DayView, WeekView, AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import Backdrop from "../../common/Backdrop";
import AppointmentCard from "./appointmentCard";
// styles, constants  block
import { PAGE_LIMIT } from "../../../constants";
import { mapAppointmentData } from "../../../utils"
import { AppointmentsPayload, useFindAllAppointmentsLazyQuery } from "../../../generated/graphql";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../reducers/appointmentReducer";

const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, appointments } = state;


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
      console.log("ppppppppppppppppppppppppppppppppppppppp")
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { appointments } = findAllAppointments || {}

        dispatch({
          type: ActionType.SET_APPOINTMENTS,
          appointments: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  useEffect(() => {
    findAllAppointments();
  }, [findAllAppointments]);

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  const Appointment = ({
    children, style, ...restProps
  }: any) => {
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

  return (
    <Card>
      {appointmentsLoading ? <Backdrop loading={true} /> :
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
      }
    </Card>
  )
};

export default StartProjectComponent;
