// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, InputLabel, FormControl } from "@material-ui/core";
// utils and interfaces block
import { requiredLabel } from "../../../../../utils";
import { ServiceInputControlsProps } from "../../../../../interfacesTypes";

const ServiceController: FC<ServiceInputControlsProps> = ({
  controllerName, controllerLabel, fieldType, error, isRequired
}): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName}>
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
};

export default ServiceController;
