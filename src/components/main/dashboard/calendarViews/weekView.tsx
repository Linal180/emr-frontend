// packages block
import { WeekView } from "@devexpress/dx-react-scheduler-material-ui";
// context, constants block
import { APPOINTMENTS_ROUTE } from "../../../../constants";
import history from "../../../../history";
export const WeekTimeTableCell = (props: WeekView.TimeTableCellProps) => {

  const handleViewDate = (props: any) => {
    const startDateDay = props.startDate
    history.push(`${APPOINTMENTS_ROUTE}/new?date=${startDateDay}`)
  }

  return <WeekView.TimeTableCell {...props} onDoubleClick={() => { handleViewDate(props) }} />;
};