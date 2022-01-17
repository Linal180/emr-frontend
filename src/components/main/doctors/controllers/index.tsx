// packages block
import { FC } from "react";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
// interface block
import { DoctorInputControlProps } from "../../../../interfacesTypes";

const DoctorController: FC<DoctorInputControlProps> = ({ controllerName, controllerLabel, fieldType, error }): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName}>
            {controllerLabel}
          </InputLabel>

          <TextField
            fullWidth
            error={invalid}
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

export default DoctorController;
