import 'date-fns';
import { FC } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// interfaces block
import { VALID_DATE_REQUIRED } from "../../constants";
import { DatePickerProps } from "../../interfacesTypes";

const DatePicker: FC<DatePickerProps> = ({ name, label, error }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={`${name}-dialog`}>
            {label}
          </InputLabel>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              value={field.value}
              onChange={field.onChange}
              error={invalid}
              helperText={error && VALID_DATE_REQUIRED}
              id={`${name}-dialog`}
              variant="inline"
              format="dd/MM/yyyy"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change date', }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
    />
  );
}

export default DatePicker;
