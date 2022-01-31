// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, InputLabel, FormControl } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { requiredLabel } from "../../../../utils";
import { FacilityInputControlProps } from "../../../../interfacesTypes";

const FacilityController: FC<FacilityInputControlProps> = ({
  controllerName, controllerLabel, fieldType, error, disabled, isRequired
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
            disabled={disabled}
            fullWidth
            {...field}
            helperText={error}
          />
        </FormControl>
      )}
    />
  );
};

export default FacilityController;
