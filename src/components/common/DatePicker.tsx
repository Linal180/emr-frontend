import { FC, useState } from 'react';
import 'date-fns';
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from "react-hook-form";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// interfaces constants and utils block
import { requiredLabel } from '../../utils';
import { DatePickerProps } from "../../interfacesTypes";
import { ContactSupportOutlined } from '@material-ui/icons';

const DatePicker: FC<DatePickerProps> = ({ name, label, error, isRequired }): JSX.Element => {
  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const { control } = useFormContext()
  
  console.log("Name:", name, "======", error)
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={`${name}-dialog`}>
            {isRequired ? requiredLabel(label) : label}
          </InputLabel>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              {...field}
              id={`${name}-dialog`}
              variant="inline"
              format="MM/dd/yyyy"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change date', }}
              open={openPicker}
              value={field.value}
              onClick={() => setOpenPicker(!openPicker)}
              onClose={() => setOpenPicker(!openPicker)}
              onChange={field.onChange}
              onKeyDown={(e) => e.preventDefault()}
              error={invalid}
              helperText={error}
              autoOk
              clearable
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
    />
  );
}

export default DatePicker;
