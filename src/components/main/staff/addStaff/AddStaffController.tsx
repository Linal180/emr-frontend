// packages block
import { FormControl, InputLabel, TextField } from "@material-ui/core";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
//components
// styles, constants, utils and interfaces block
import { PASSWORD, TEXT } from "../../../../constants";
import { AddStaffInputControlProps } from "../../../../interfacesTypes";

const AddStaffController: FC<AddStaffInputControlProps> = ({ control, controllerName, controllerLabel, fieldType, error }): JSX.Element => {
  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { invalid } }) => (
        <FormControl fullWidth>
          <InputLabel shrink htmlFor={controllerName}>
            {controllerLabel}
          </InputLabel>

          <TextField
            fullWidth
            error={invalid}
            margin="normal"
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

export default AddStaffController;
