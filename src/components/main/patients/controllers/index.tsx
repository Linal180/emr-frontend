// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";

const PatientController: FC<any> = ({ controllerName, controllerLabel, fieldType, error, disabled }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName}>
            {controllerLabel}
          </InputLabel>

          <TextField
            fullWidth
            error={invalid}
            disabled={disabled}
            type={fieldType}
            variant="outlined"
            id={controllerName}
            helperText={error && error}
            {...field}
          />
        </FormControl>
      )}
    />
  );
};

export default PatientController;
