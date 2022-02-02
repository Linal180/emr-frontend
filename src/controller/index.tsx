// packages block
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { requiredLabel } from "../utils";
import { PASSWORD, TEXT } from "../constants";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";
const InputController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, isPassword, disabled
}): JSX.Element => {
  const { control } = useFormContext()
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
            {isRequired ? requiredLabel(controllerLabel) : controllerLabel}
          </InputLabel>
          <TextField
            fullWidth
            error={invalid}
            variant="outlined"
            disabled={disabled}
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
export default InputController;