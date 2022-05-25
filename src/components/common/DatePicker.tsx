import { FC, useState } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, IconButton, InputLabel } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
// interfaces constants and utils block
import { requiredLabel } from '../../utils';
import { US_DATE_FORMAT } from '../../constants';
import { PickerProps } from "../../interfacesTypes";
import { CalendarIcon, ClearIcon } from '../../assets/svgs';

const DatePicker: FC<PickerProps> = ({ name, label, isRequired, clearable = false, disableFuture=true }): JSX.Element => {
  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const { control, setValue } = useFormContext()
  
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal" error={invalid}>
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
              placeholder={US_DATE_FORMAT}
              value={field.value}
              onClick={() => setOpenPicker(!openPicker)}
              onClose={() => setOpenPicker(!openPicker)}
              onChange={field.onChange}
              onKeyDown={(e) => e.preventDefault()}
              error={invalid}
              helperText={invalid && message}
              autoOk
              disableFuture={disableFuture}
              maxDate="2100-01-31"
              keyboardIcon={<CalendarIcon />}
              InputProps={ clearable ? {
                startAdornment: <IconButton aria-label="clear" onClick={()=> setValue(name, null)}>
                  <ClearIcon />
                </IconButton>
              }: undefined
            }
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      )}
    />
  );
}

export default DatePicker;
