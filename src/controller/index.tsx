// packages block
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { PASSWORD, TEXT } from "../constants";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";
import { DetailTooltip } from "../styles/tableStyles";
import { useFormStyles } from "../styles/formsStyles";
import { InfoOutlined } from "@material-ui/icons";

const InputController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, isPassword, disabled, info
}): JSX.Element => {
  const classes = useFormStyles();
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
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
        <FormControl fullWidth margin="normal">
          <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
            {isRequired ? `${controllerLabel} *` : controllerLabel}

            {info &&
              <Box>
                <DetailTooltip placement="top-end" arrow title={info}>
                  <InfoOutlined color="inherit" fontSize="inherit" />
                </DetailTooltip>
              </Box>
            }
          </InputLabel>


          <TextField
            fullWidth
            error={invalid}
            variant="outlined"
            disabled={disabled}
            id={controllerName}
            type={fieldType === "password" ? passwordType : fieldType}
            helperText={error ? error : message}
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
