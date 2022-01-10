// packages block
import { TextField, InputLabel, FormControl } from "@material-ui/core";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
// styles, constants, utils and interfaces block
import { UpdateFacilityInputControlProps } from "../../../../interfacesTypes";

const UpdateFacilityController: FC<UpdateFacilityInputControlProps> = ({ controllerName, controllerLabel, fieldType, error }): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName}>{controllerLabel}</InputLabel>

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

export default UpdateFacilityController;
