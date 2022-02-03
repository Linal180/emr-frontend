// packages block
import { useState } from "react";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

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
                disableToolbar
            />
        </MuiPickersUtilsProvider>
    )
}

export default AppointmentDatePicker;

