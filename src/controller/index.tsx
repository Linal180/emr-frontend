// packages block
import { FC, useState, Fragment } from "react";
import { Search } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, IconButton, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { requiredLabel } from "../utils";
import { PASSWORD, TEXT } from "../constants";
import { ClearIcon, InfoIcon } from "../assets/svgs";
import { DetailTooltip } from "../styles/tableStyles";
import { useFormStyles } from "../styles/formsStyles";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";

const InputController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, isPassword, endAdornment, onBlur,
  disabled, multiline, info, placeholder, className, isSearch, margin, clearable, handleClearField,
}): JSX.Element => {
  const classes = useFormStyles();
  const { control } = useFormContext();
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
        <FormControl fullWidth margin={margin || "normal"} error={Boolean(invalid)}>
          <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
            {isRequired ? requiredLabel(controllerLabel || '') : controllerLabel}

            {info &&
              <Box>
                <DetailTooltip placement="top-end" arrow title={info}>
                  <Box width={15} height={15}>
                    <InfoIcon />
                  </Box>
                </DetailTooltip>
              </Box>
            }
          </InputLabel>

          <TextField
            fullWidth
            error={invalid}
            variant="outlined"
            multiline={multiline}
            minRows={3}
            className={className}
            disabled={disabled}
            id={controllerName}
            placeholder={placeholder ? placeholder : ""}
            type={fieldType === "password" ? passwordType : fieldType}
            helperText={error ? error : message}
            {...field}
            onBlur={() => onBlur && onBlur()}
            InputProps={isPassword ? {
              endAdornment: <ShowPassword
                isPassword={isPassword}
                passwordType={passwordType}
                handleShowPassword={handleClickShowPassword}
              />,
            } : clearable ? {
              endAdornment: <IconButton aria-label="clear" onClick={handleClearField ? () => handleClearField(controllerName) : () => { }}>
                <ClearIcon />
              </IconButton>
            } : fieldType === 'number' ?
              {
                inputProps: { step: '5' },
                endAdornment: endAdornment ? endAdornment : <></>
              } : isSearch ? {
                endAdornment: <Search />
              } : endAdornment ? { endAdornment } : undefined}
          />
        </FormControl>
      )}
    />
  );
};

export default InputController;
