// packages block
import { useState } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const AppointmentDatePicker = (): JSX.Element => {
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        variant="static"
        openTo="date"
        value={date}
        onChange={currentDate => currentDate && setDate(currentDate)}
        autoOk
        fullWidth
        disablePast
        disableToolbar
      />
    </MuiPickersUtilsProvider>
  )
}

export default AppointmentDatePicker;
