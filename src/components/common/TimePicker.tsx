import 'date-fns';
import { FC } from 'react';
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, FormHelperText, TextField } from '@material-ui/core';
// interfaces constants and utils block
import { PickerProps } from "../../interfacesTypes";
import { renderLoading, requiredLabel } from '../../utils';

const TimePicker: FC<PickerProps> = ({ name, label, isRequired, loading, disabled }): JSX.Element => {
  const { control } = useFormContext()
  const inputLabel = isRequired ? requiredLabel(label) : label

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          name={name}
          control={control}
          defaultValue=''
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
            <FormControl fullWidth margin="normal" error={Boolean(invalid)}>
              <InputLabel shrink htmlFor={`${name}-dialog`}>
                {inputLabel}
              </InputLabel>

              <TextField
                id={`${name}-dialog`}
                {...field}
                type="time"
                defaultValue="07:30"
                className="timePickerIcon"
                error={invalid}
                inputProps={{ step: 300, }}
                disabled={disabled}
                
              />

              <FormHelperText>{message}</FormHelperText>
            </FormControl>
          )}
        />}
    </>
  );
}

export default TimePicker;
