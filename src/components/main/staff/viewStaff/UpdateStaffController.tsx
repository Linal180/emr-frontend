// packages block
import { FC, useState } from "react";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";
// components block
import ShowPassword from "../../../common/ShowPassword";
// styles, constants, utils and interfaces block
import {PASSWORD, TEXT } from "../../../../constants";
import { UpdateStaffInputControlProps, PasswordType } from "../../../../interfacesTypes";

const UpdateStaffController: FC<UpdateStaffInputControlProps> = ({ control, isPassword, controllerName, controllerLabel, fieldType, error, disabled }): JSX.Element => {
  const [passwordType, setPasswordType] = useState<PasswordType>(PASSWORD);

  const handleClickShowPassword = () => {
    if (passwordType === PASSWORD) {
      setPasswordType(TEXT);
    } else {
      setPasswordType(PASSWORD);
    }
  };

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
            variant="outlined"
            id={controllerName}
            type={fieldType === "password" ? passwordType : fieldType}
            helperText={error && error}
            {...field}
            InputProps={isPassword ? {
              endAdornment: <ShowPassword
                isPassword={isPassword}
                passwordType={passwordType}
                handleShowPassword={handleClickShowPassword}
              />,
            } : undefined}
          />
        </FormControl>
      )}
    />
  );
};

export default UpdateStaffController;
