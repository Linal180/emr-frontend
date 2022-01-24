//packages block
import { FC } from "react";
import { Controller } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// interfaces types block
import { LoginInputControlProps } from "../../../../interfacesTypes";

const PublicAppointmentController: FC<LoginInputControlProps> = ({ control, controllerName, controllerLabel, fieldType, error }): JSX.Element => (
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
          type={fieldType}
          id={controllerName}
          variant="outlined"
          error={invalid}
          fullWidth
          helperText={error && error}
          {...field}
        />
      </FormControl>
    )}
  />
);


export default PublicAppointmentController;
