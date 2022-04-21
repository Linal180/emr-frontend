// packages block
import { DayView } from "@devexpress/dx-react-scheduler-material-ui";
// context, constants block
import { APPOINTMENTS_ROUTE } from "../../../../constants";
import history from "../../../../history";
export const DayTimeTableCell = (props: DayView.TimeTableCellProps) => {

  const handleViewDate = (props: any) => {
    const startDateDay = props.startDate
    const endDateDay = props.endDate
    history.push(`${APPOINTMENTS_ROUTE}/new?startDate=${startDateDay}&endDate=${endDateDay}`)
  }

  return <DayView.TimeTableCell {...props} onDoubleClick={() => { handleViewDate(props) }} />;
};