import { FC } from 'react';
import { FormControl, InputLabel, TextField } from '@material-ui/core';
import { Controller, useFormContext } from "react-hook-form";
// interfaces constants and utils block
import { requiredLabel } from '../../utils';
import { TimePickerProps } from "../../interfacesTypes";

const TimePicker: FC<TimePickerProps> = ({ controllerName, controllerLabel, error, isRequired, fieldType }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=''
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={`${controllerName}-dialog`}>
            {isRequired ? requiredLabel(controllerLabel) : controllerLabel}
          </InputLabel>

          <TextField
            type={fieldType}
            variant="outlined"
            error={invalid}
            fullWidth
            {...field}
            helperText={error}
          />
        </FormControl>
      )}
    />
  );
}

export default TimePicker;
