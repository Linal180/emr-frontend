// packages block
import { useEffect, useCallback, Reducer, useState, useReducer, useContext, useRef, FC } from "react";
import classNames from "clsx";
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { Box, Card, CircularProgress } from "@material-ui/core";
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, DayView, WeekView,
  AppointmentTooltip, ViewSwitcher, CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import AppointmentCard from "./appointmentsComponent/appointmentCard";
import { DayTimeTableCell } from "./calendarViews/dayView";
import { WeekTimeTableCell } from "./calendarViews/weekView";
import { MonthTimeTableCell } from "./calendarViews/monthView";
import { IntegratedAppointments } from "./integratedAppointments";
import { Appointment } from "./appointmentsComponent/appointments";
import { AppointmentContent } from "./appointmentsComponent/appointmentContent";
import { AppointmentContainer } from "./appointmentsComponent/appointmentContainer";
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
import PageHeader from "../../common/PageHeader";
import { CALENDAR_VIEW_APPOINTMENTS_BREAD, CALENDAR_VIEW_TEXT, DASHBOARD_BREAD } from "../../../constants";
import { useIndicatorStyles } from "../../../styles/indicatorStyles";
//Interfaces
import { CalenderProps } from "../../../interfacesTypes";

const CalendarComponent :FC<CalenderProps> = ({showHeader}): JSX.Element => {

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
  const indicatorRef = useRef<Element>(null);

  const Indicator = ({ top, ...restProps }: any) => {
    const classes = useIndicatorStyles({ top });

    return (
      <div {...restProps} ref={indicatorRef}>
        <div className={classNames(classes.nowIndicator, classes.circle)} />
        <div className={classNames(classes.nowIndicator, classes.line)} />
      </div>
    );
  };

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
    indicatorRef?.current?.scrollIntoView({ block: "center" });
  });

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments]);


  return (
    <>
      {
        showHeader &&
        <PageHeader
        title={CALENDAR_VIEW_TEXT}
        path={[DASHBOARD_BREAD, CALENDAR_VIEW_APPOINTMENTS_BREAD]}
      />
      }

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
              <CurrentTimeIndicator
                shadePreviousCells={true}
                shadePreviousAppointments={true}
                indicatorComponent={Indicator}
              />
            </Scheduler>
          </Box>
        </Box>
      </Card>
    </>
  )
};

export default CalendarComponent;
