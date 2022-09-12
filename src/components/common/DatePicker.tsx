import { FC, useState } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { Controller, useFormContext } from "react-hook-form";
import { Box, Button, FormControl, InputLabel } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
// interfaces constants and utils block
import { US_DATE_FORMAT } from '../../constants';
import { PickerProps } from "../../interfacesTypes";
import { renderLoading, requiredLabel } from '../../utils';
import { CalendarIcon, ClearIcon } from '../../assets/svgs';

const DatePicker: FC<PickerProps> = ({
  name, label, isRequired, clearable = false, disableFuture = true, disabled, disablePast,
  loading, defaultValue, onSelect, format
}): JSX.Element => {
  const { control, setValue } = useFormContext()
  const [openPicker, setOpenPicker] = useState<boolean>(false)
  const inputLabel = isRequired ? requiredLabel(label) : label

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue ? defaultValue : ""}
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
                  format={format ? format : "MM/dd/yyyy"}
                  inputVariant="outlined"
                  KeyboardButtonProps={{ 'aria-label': 'change date', }}
                  open={openPicker}
                  placeholder={US_DATE_FORMAT}
                  disabled={disabled}
                  value={field.value}
                  // onClick={disabled ? () => { } : () => setOpenPicker(!openPicker)}
                  onClose={disabled ? () => { } : () => setOpenPicker(!openPicker)}
                  // onKeyDown={(e) => e.preventDefault()}
                  error={invalid}
                  helperText={invalid && message}
                  autoOk
                  disablePast={disablePast ? disablePast : false}
                  disableFuture={disableFuture}
                  maxDate="2100-01-31"
                  minDate="1900-01-01"
                  keyboardIcon={<Box width={20} onClick={() => setOpenPicker(!openPicker)}>
                    <CalendarIcon />
                  </Box>
                  }
                  onChange={(_, data) => {
                    field.onChange(data)
                    onSelect && onSelect(data)

                    return data
                  }}

                  InputProps={clearable ? {
                    startAdornment: <Button aria-label="clear" className='icon-button-hover' onClick={() => setValue(name, null)}>
                      <ClearIcon />
                    </Button>
                  } : undefined
                  }
                  className='hello'
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          )}
        />}
    </>
  );
}

export default DatePicker;
