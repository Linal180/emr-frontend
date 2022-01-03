//packages block
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";
// components block
import ShowPassword from "../../common/ShowPassword";
//styles and interfaceTypes
import { PASSWORD, TEXT } from "../../../constants";
import { useLoginStyles } from "../../../styles/loginStyles";
import { LoginInputControlProps, PasswordType } from "../../../interfacesTypes";

const LoginController: FC<LoginInputControlProps> = ({ control, controllerName, controllerLabel, fieldType, error, isPassword }): JSX.Element => {
  const classes = useLoginStyles();
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
        <TextField
          type={fieldType === "password" ? passwordType : fieldType}
          variant="outlined"
          margin="normal"
          error={invalid}
          label={controllerLabel}
          fullWidth
          helperText={error && error}
          {...field}
          InputLabelProps={{
            className: classes.labelText,
          }}
          InputProps={isPassword ? {
            endAdornment: <ShowPassword
              isPassword={isPassword}
              passwordType={passwordType}
              handleShowPassword={handleClickShowPassword}
            />,
          } : undefined}
        />
      )}
    />
  );
};

export default LoginController;
