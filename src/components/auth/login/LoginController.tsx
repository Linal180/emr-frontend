//packages block
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../../common/ShowPassword";
//styles and interfaceTypes
import { PASSWORD, TEXT } from "../../../constants";
import { LoginInputControlProps, PasswordType } from "../../../interfacesTypes";

const LoginController: FC<LoginInputControlProps> = ({ control, controllerName, controllerLabel, fieldType, error, isPassword }): JSX.Element => {
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
        <FormControl fullWidth>
          <InputLabel shrink htmlFor={controllerName}>
            {controllerLabel}
          </InputLabel>

          <TextField
            type={fieldType === "password" ? passwordType : fieldType}
            id={controllerName}
            variant="outlined"
            margin="normal"
            error={invalid}
            fullWidth
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

export default LoginController;
