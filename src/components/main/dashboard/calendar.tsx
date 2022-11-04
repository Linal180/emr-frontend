// packages block
import {
  useEffect, useCallback, Reducer, useReducer, useContext, useRef, FC, useState
} from "react";
import classNames from "clsx";
import { Box, Card } from "@material-ui/core";
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, DayView, WeekView,
  AppointmentTooltip, ViewSwitcher, CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
// component block
import Alert from "../../common/Alert";
import Loader from "../../common/Loader";
import PageHeader from "../../common/PageHeader";
import { DayTimeTableCell } from "./calendarViews/dayView";
import { WeekTimeTableCell } from "./calendarViews/weekView";
import { MonthTimeTableCell } from "./calendarViews/monthView";
import { IntegratedAppointments } from "./integratedAppointments";
import { Appointment } from "./appointmentsComponent/appointments";
import AppointmentCard from "./appointmentsComponent/appointmentCard";
import { AppointmentContent } from "./appointmentsComponent/appointmentContent";
import { AppointmentContainer } from "./appointmentsComponent/appointmentContainer";
// context, constants block
import { AuthContext } from "../../../context";
import { CalenderProps } from "../../../interfacesTypes";
import { useCalendarStyles } from "../../../styles/calendarStyles";
import { useIndicatorStyles } from "../../../styles/indicatorStyles";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../reducers/appointmentReducer";
import { AppointmentsPayload, useFetchCalendarAppointmentsLazyQuery } from "../../../generated/graphql";
import {
  isSuperAdmin, isPracticeAdmin, isFacilityAdmin, mapAppointmentData, isOnlyDoctor, isStaff
} from "../../../utils"
import {
  CALENDAR_VIEW_APPOINTMENTS_BREAD, CALENDAR_VIEW_TEXT, DASHBOARD_BREAD, SOMETHING_WENT_WRONG
} from "../../../constants";

const CalendarComponent: FC<CalenderProps> = ({ showHeader }): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<string>('Month')

  const [data, setData] = useState<any[]>([])
  const classes = useCalendarStyles()
  const { user } = useContext(AuthContext)
  const { facility, roles, userId } = user || {}

  const { id: facilityId, practiceId } = facility || {}
  const isSuper = isSuperAdmin(roles);
  const isPractice = isPracticeAdmin(roles);

  const isStaffUser = isStaff(roles);
  const isDoctor = isOnlyDoctor(roles);
  const isFacility = isFacilityAdmin(roles);

  const indicatorRef = useRef<Element>(null);
  const [{ appointments, page, appOpen }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)

  const Indicator = ({ top, ...restProps }: any) => {
    const classes = useIndicatorStyles({ top });

    return (
      <div {...restProps} ref={indicatorRef}>
        <div className={classNames(classes.nowIndicator, classes.circle)} />
        <div className={classNames(classes.nowIndicator, classes.line)} />
      </div>
    );
  };

  const [findAllAppointments, { loading: fetchAllAppointmentsLoading }] = useFetchCalendarAppointmentsLazyQuery({
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
          appointments: appointments as AppointmentsPayload['appointments']
        });
      }
    }
  });

  const onCommitChanges = useCallback(({ added, changed, deleted }) => {
    if (added) {
      const startingAddedId =
        Array.isArray(data) && data.length > 0 ? data && data[data.length - 1].id + 1 : 0;
      setData([...data, { id: startingAddedId, ...added }]);
    }

    if (changed) {
      setData(
        data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] } : appointment
        )
      );
    }

    if (deleted !== undefined) {
      setData(data.filter(appointment => appointment.id !== deleted));
    }
  }, [setData, data]);


  const handleDateChange = (currentDate: Date) => setCurrentDate(currentDate)

  const fetchAppointments = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: 125 } }
      let inputs = isSuper ? {}
        : isPractice ? { practiceId }
          : isFacility || isStaffUser ? { facilityId }
            : isDoctor ? { providerId: userId } : undefined

      !!inputs ? await findAllAppointments({
        variables: {
          appointmentInput: { ...inputs, ...pageInputs }
        },
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [
    page, isSuper, isPractice, isFacility, isStaffUser, isDoctor, findAllAppointments,
    practiceId, facilityId, userId
  ])

  const currentViewNameChange = (currentViewName: string) => setCurrentView(currentViewName);

  useEffect(() => {
    indicatorRef?.current?.scrollIntoView({ block: "center" });
  });

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments]);

  if (fetchAllAppointmentsLoading) {
    return <Loader loading loaderText="Fetching Appointments..." />
  }

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
        <Box className={classes.customCalender}>
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

              <Appointments
                appointmentComponent={Appointment}
                containerComponent={AppointmentContainer}
                appointmentContentComponent={AppointmentContent}
              />

              <AppointmentTooltip
                showCloseButton
                onVisibilityChange={(val) => dispatch({ type: ActionType.SET_APP_OPEN, appOpen: val })}
                layoutComponent={(props) =>
                  <AppointmentCard
                    appOpen={appOpen}
                    tooltip={props}
                    setCurrentView={setCurrentView}
                    setCurrentDate={setCurrentDate}
                    reload={fetchAppointments}
                  />}
              />

              <CurrentTimeIndicator
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
