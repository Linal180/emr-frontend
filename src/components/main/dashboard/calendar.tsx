// packages block
import { useEffect, useCallback, Reducer, useState, useReducer, useContext } from "react";
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { DayTimeTableCell } from "./calendarViews/dayView";
import { WeekTimeTableCell } from "./calendarViews/weekView";
import { MonthTimeTableCell } from "./calendarViews/monthView";
import { Box, Card, CircularProgress } from "@material-ui/core";
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, DayView, WeekView,
  AppointmentTooltip, ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentCard";
// context, constants block
import { AuthContext } from "../../../context";
import { isSuperAdmin, isUserAdmin, mapAppointmentData } from "../../../utils"
import { useCalendarStyles } from "../../../styles/calendarStyles";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../reducers/appointmentReducer";
import {
  useFindAllAppointmentsLazyQuery, AppointmentsPayload, Appointmentstatus
} from "../../../generated/graphql";
import { IntegratedAppointments } from "./integratedAppointments";

const CalendarComponent = (): JSX.Element => {
  const classes = useCalendarStyles()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<string>('Month')
  const [data, setData] = useState<any[]>([])
  const { user } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isAdmin = isUserAdmin(roles);
  const [{ appointments, page }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const [findAllAppointments, { loading: fetchAllAppointmentsLoading }] = useFindAllAppointmentsLazyQuery({
    variables: {
      appointmentInput: {
        practiceId: practiceId || '',
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
          appointments: appointments?.filter(appointment =>
            appointment?.status !== Appointmentstatus.Cancelled) as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const startingAddedId =
          Array.isArray(data) && data.length > 0 ? data && data[data.length - 1].id + 1 : 0;
        setData([...data, { id: startingAddedId, ...added }]);
      }
      if (changed) {
        setData(
          data.map(appointment =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
      }
      if (deleted !== undefined) {
        setData(data.filter(appointment => appointment.id !== deleted));
      }
    },
    [setData, data]
  );


  const handleDateChange = (currentDate: Date) => setCurrentDate(currentDate)

  const AppointmentContainer = ({ children, style, ...restProps }: any) => {
    return (
      <Appointments.Container
        {...restProps}
        style={{
          ...style,
          height: 20,
        }}
      >
        {children}
      </Appointments.Container>
    )
  };

  const AppointmentContent = ({ children, style, ...restProps }: any) => {
    const { data: { color, title } } = restProps
    const showMoreButton = title === 'Show More'
    return (
      <Appointments.AppointmentContent
        {...restProps}
        style={{
          ...style,
          backgroundColor: showMoreButton && "#939393",
          textDecoration: showMoreButton ? 'none' : 'underline',
          color: showMoreButton ? 'white' : color,
          width: 'fit-content',
          display: showMoreButton && 'flex',
          border: showMoreButton && '2px solid',
          fontWeight: !showMoreButton && 700,
          minHeight: 24,
        }}
      >
        {children}
      </Appointments.AppointmentContent>
    )
  };

  const Appointment = ({ children, style, color, ...restProps }: any) => {
    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: 'transparent',
          borderBottom: 0,
          borderRadius: 0,
          width: 'fit-content'
        }
        }
      >
        {children}
      </Appointments.Appointment >
    )
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: 25 } }
      const inputs = isSuper ? { ...pageInputs } :
        !isAdmin ? { facilityId, ...pageInputs } : { practiceId, ...pageInputs }

      await findAllAppointments({
        variables: {
          appointmentInput: { ...inputs }
        },
      })
    } catch (error) { }
  }, [page, isSuper, isAdmin, facilityId, practiceId, findAllAppointments])

  const currentViewNameChange = (currentViewName: string) => {
    setCurrentView(currentViewName);
  };

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments]);

  return (
    <Card>
      <Box>
        {fetchAllAppointmentsLoading &&
          <Box className={classes.loader}><CircularProgress color="inherit" /></Box>
        }

        <Box className={fetchAllAppointmentsLoading ? classes.blur : classes.cursor}>
          <Scheduler data={mapAppointmentData(appointments)}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={(currentDate) => { handleDateChange(currentDate) }}
              currentViewName={currentView}
              onCurrentViewNameChange={currentViewNameChange} />
            <EditingState onCommitChanges={onCommitChanges} />
            <MonthView timeTableCellComponent={MonthTimeTableCell} />
            <WeekView timeTableCellComponent={WeekTimeTableCell} />
            <DayView timeTableCellComponent={DayTimeTableCell} />
            <Toolbar />
            <TodayButton />
            <ViewSwitcher />
            <IntegratedEditing />
            <IntegratedAppointments />
            <DateNavigator />
            <Appointments appointmentComponent={Appointment}
              appointmentContentComponent={AppointmentContent}
              containerComponent={AppointmentContainer} />
            <AppointmentTooltip
              showCloseButton
              layoutComponent={(props) => <AppointmentCard tooltip={props}
                setCurrentView={setCurrentView}
                setCurrentDate={setCurrentDate} />} />
          </Scheduler>
        </Box>
      </Box>
    </Card>
  )
};

export default CalendarComponent;
