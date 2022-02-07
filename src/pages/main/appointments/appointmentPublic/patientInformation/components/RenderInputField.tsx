import { FormControl, InputLabel, TextField } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { RenderInputFieldProps } from '../../../../../../interfacesTypes';


const RenderInputField = ({ name, label, control }: RenderInputFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={name}>
            {label}
          </InputLabel>

          <TextField
            type="text"
            id={name}
            variant="outlined"
            error={invalid}
            fullWidth
            // helperText={"error && error"}
            {...field}
          />
        </FormControl>
      )}
    />
  );
};

export default RenderInputField;
