//packages block
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { Box, FormControl, InputLabel, TextField, Typography } from "@material-ui/core";
// components block
import ShowPassword from "../../common/ShowPassword";
//styles and interfaceTypes
import { useLoginStyles } from "../../../styles/loginStyles";
import { LoginInputControlProps, PasswordType } from "../../../interfacesTypes";
import { FORGET_PASSWORD_ROUTE, FORGOT_PASSWORD, PASSWORD, TEXT } from "../../../constants";

const LoginController: FC<LoginInputControlProps> = ({
  control, controllerName, controllerLabel, fieldType, error, isPassword, disabled
}): JSX.Element => {
  const [passwordType, setPasswordType] = useState<PasswordType>(PASSWORD);
  const classes = useLoginStyles();
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
          <Box position="relative">
            <InputLabel shrink htmlFor={controllerName}>
              {controllerLabel}
            </InputLabel>

            {isPassword &&
              <Box>
                <Typography component={Link} to={FORGET_PASSWORD_ROUTE} className={classes.forgotPassword}>
                  {FORGOT_PASSWORD}
                </Typography>
              </Box>
            }
          </Box>

          <TextField
            type={fieldType === "password" ? passwordType : fieldType}
            id={controllerName}
            variant="outlined"
            error={invalid}
            disabled={disabled}
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
