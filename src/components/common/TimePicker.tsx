import 'date-fns';
import { FC } from 'react';
import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core';
import { Controller, useFormContext } from "react-hook-form";
// interfaces constants and utils block
import { requiredLabel } from '../../utils';
import { PickerProps } from "../../interfacesTypes";

const TimePicker: FC<PickerProps> = ({ name, label, isRequired }): JSX.Element => {
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

          <OutlinedInput
            id={`${name}-dialog`}
            {...field}
            type="time"
            defaultValue="07:30"
            error={invalid}
            inputProps={{ step: 300, }}
          />

          <FormHelperText>{message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default TimePicker;
