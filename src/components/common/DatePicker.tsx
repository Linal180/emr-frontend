import 'date-fns';
import { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Controller, useFormContext } from "react-hook-form";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// interfaces block
import {VALID_DATE_REQUIRED} from "../../constants";
import { DatePickerProps } from "../../interfacesTypes";

const DatePicker: FC<DatePickerProps> = ({ name, label, error }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              label={label}
              margin="normal"
              format="dd/MM/yyyy"
              value={field.value}
              id="date-picker-dialog"
              onChange={field.onChange}
              error={invalid}
              helperText={error && VALID_DATE_REQUIRED}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        )
      }}
    />
  );
}

export default DatePicker;
