import 'date-fns';
import { FC, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { FormControl, InputLabel } from '@material-ui/core';
import { Controller, useFormContext } from "react-hook-form";
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
// interfaces constants and utils block
import { requiredLabel } from '../../utils';
import { PickerProps } from "../../interfacesTypes";

const TimePicker: FC<PickerProps> = ({ name, label, isRequired }): JSX.Element => {
  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={`${name}-dialog`}>
            {isRequired ? requiredLabel(label) : label}
          </InputLabel>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              {...field}
              id={`${name}-dialog`}
              variant="inline"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change time', }}
              open={openPicker}
              value={field.value}
              onClick={() => setOpenPicker(!openPicker)}
              onClose={() => setOpenPicker(!openPicker)}
              onChange={field.onChange}
              onKeyDown={(e) => e.preventDefault()}
              error={invalid}
              helperText={invalid && message}
              autoOk
              clearable
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
    />
  );
}

export default TimePicker;
