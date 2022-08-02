// packages block
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../../common/ShowPassword";
// utils. styles, constants and interfaces block
import { PASSWORD, TEXT } from "../../../constants";
import { PasswordType, ResetPasswordInputControlProps } from "../../../interfacesTypes";

const ResetPasswordController: FC<ResetPasswordInputControlProps> = ({
  controllerName, controllerLabel, fieldType, error, isPassword
}): JSX.Element => {
  const [passwordType, setPasswordType] = useState<PasswordType>(PASSWORD);
  const { control } = useFormContext();

  const handleClickShowPassword = () => passwordType === PASSWORD
    ? setPasswordType(TEXT)
    : setPasswordType(PASSWORD);

  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName}>
            {controllerLabel}
          </InputLabel>

          <TextField
            type={fieldType === PASSWORD ? passwordType : fieldType}
            id={controllerName}
            variant="outlined"
            error={invalid}
            fullWidth
            {...field}
            helperText={error ? error : message || ''}
            InputProps={{
              endAdornment: <ShowPassword
                isPassword={isPassword}
                passwordType={passwordType}
                handleShowPassword={handleClickShowPassword}
              />,
            }}
          />
        </FormControl>
      )}
    />
  );
};

export default ResetPasswordController;
