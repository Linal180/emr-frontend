// packages block
import { TextField, InputLabel, FormControl } from "@material-ui/core";
import { FC } from "react";
import { Controller } from "react-hook-form";
// styles, constants, utils and interfaces block
import { CreateFacilityInputControlProps } from "../../../../interfacesTypes";

const CreateFacilityController: FC<CreateFacilityInputControlProps> = ({ control, controllerName, controllerLabel, fieldType, error }): JSX.Element => {
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
            type={fieldType}
            variant="outlined"
            error={invalid}
            fullWidth
            {...field}
            helperText={error ? error : "hello world"}
          />
        </FormControl>
      )}
    />
  );
};

export default CreateFacilityController;
