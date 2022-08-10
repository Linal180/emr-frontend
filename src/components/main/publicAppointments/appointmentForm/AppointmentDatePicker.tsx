// packages block
import { FC } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
// interfaces block
import { AppointmentDatePickerProps } from "../../../../interfacesTypes";

const AppointmentDatePicker: FC<AppointmentDatePickerProps> = ({ date, setDate }): JSX.Element =>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <DatePicker
      variant="static"
      openTo="date"
      value={date}
      autoOk
      fullWidth
      disableToolbar
      onChange={currentDate => currentDate && setDate(currentDate)}
    />
  </MuiPickersUtilsProvider>

export default AppointmentDatePicker;
