// packages block
import { MonthView } from "@devexpress/dx-react-scheduler-material-ui";
// context, constants block
import { APPOINTMENTS_ROUTE } from "../../../../constants";
import history from "../../../../history";

export const MonthTimeTableCell = (props: MonthView.TimeTableCellProps) => {

  const handleViewDate = (props: any) => {
    const startDateDay = props.startDate
    history.push(`${APPOINTMENTS_ROUTE}/new?date=${startDateDay}`)
  }

  return <MonthView.TimeTableCell {...props} onDoubleClick={() => { handleViewDate(props) }} />;
};