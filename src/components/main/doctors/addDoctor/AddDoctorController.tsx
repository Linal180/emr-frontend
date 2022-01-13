// packages block
import { FormControl, InputLabel, TextField } from "@material-ui/core";
import { FC } from "react";
import { Controller } from "react-hook-form";

const AddDoctorController: FC<any> = ({ control, controllerName, controllerLabel, fieldType, error }): JSX.Element => {
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

export default AddDoctorController;
