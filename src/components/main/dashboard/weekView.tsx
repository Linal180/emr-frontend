import {
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@material-ui/core";
import { APPOINTMENTS_ROUTE } from "../../../constants";
import history from "../../../history";
import { useCalendarStyles } from "../../../styles/calendarStyles";
export const TimeTableCell = (props: WeekView.TimeTableCellProps) => {
  const classes = useCalendarStyles()
  const handleViewDate = (props: any) => {
    const startDateDay = props.startDate
    history.push(`${APPOINTMENTS_ROUTE}/new?date=${startDateDay}`)
  }
  return <WeekView.TimeTableCell {...props} ><Button className={classes.viewsDate} onClick={() => { handleViewDate(props) }} /></WeekView.TimeTableCell >;
};