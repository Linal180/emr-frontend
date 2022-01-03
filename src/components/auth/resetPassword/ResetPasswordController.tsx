// packages block
import { FC, useState } from "react";
import { TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";
// components block
import ShowPassword from "../../common/ShowPassword";
// utils. styles, constants and interfaces block
import { PASSWORD, TEXT } from "../../../constants";
import { useLoginStyles } from "../../../styles/loginStyles";
import { PasswordType, ResetPasswordInputControlProps } from "../../../interfacesTypes";

const ResetPasswordController: FC<ResetPasswordInputControlProps> = ({
  control,
  controllerName,
  controllerLabel,
  fieldType,
  error,
  isPassword
}): JSX.Element => {
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
      render={({ field, fieldState: { invalid } }) => (
        <TextField
          type={fieldType === PASSWORD ? passwordType : fieldType}
          variant="outlined"
          margin="normal"
          error={invalid}
          label={controllerLabel}
          fullWidth
          {...field}
          InputLabelProps={{
            className: classes.labelText
          }}
          helperText={error && error}
          InputProps={{
            endAdornment: <ShowPassword
              isPassword={isPassword}
              passwordType={passwordType}
              handleShowPassword={handleClickShowPassword}
            />,
          }}
        />
      )}
    />
  );
};

export default ResetPasswordController;
