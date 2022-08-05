// packages block
import { FC, useState } from "react";
import { Search } from "@material-ui/icons";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, IconButton, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { PASSWORD, TEXT } from "../constants";
import { ClearIcon, InfoIcon } from "../assets/svgs";
import { DetailTooltip } from "../styles/tableStyles";
import { useFormStyles } from "../styles/formsStyles";
import { renderLoading, requiredLabel } from "../utils";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";

const InputController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, isPassword, endAdornment, onBlur,
  disabled, multiline, info, placeholder, className, isSearch, margin, clearable, handleClearField,
  notStep, isHelperText, autoFocus, isHtmlValidate, defaultValue, loading, onChange
}): JSX.Element => {
  const classes = useFormStyles();
  const { control } = useFormContext();
  const [passwordType, setPasswordType] = useState<PasswordType>(PASSWORD);
  const label = isRequired ? requiredLabel(controllerLabel || '') : controllerLabel

  const handleClickShowPassword = () => {
    if (passwordType === PASSWORD) setPasswordType(TEXT);
    else setPasswordType(PASSWORD);
  };

  return (
    <>
      {loading ? renderLoading(label || '') :
        <Controller
          name={controllerName}
          control={control}
          defaultValue={defaultValue ? defaultValue : ''}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
            <FormControl fullWidth margin={margin || "normal"} error={Boolean(invalid)}>
              <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
                {label}

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
                {...field}
                fullWidth
                error={invalid}
                variant="outlined"
                multiline={multiline}
                minRows={3}
                className={`${className} ${!!multiline ? classes.multilineInput : ''}`}
                required={isHtmlValidate && isRequired}
                disabled={disabled}
                onChange={(event) => {
                  field.onChange(event)
                  onChange && onChange(event.target.value)
                }
                }
                id={controllerName}
                autoFocus={autoFocus}
                placeholder={placeholder ? placeholder : ""}
                type={fieldType === "password" ? passwordType : fieldType}
                helperText={!isHelperText ? error ? error : message : ""}
                onBlur={() => onBlur && onBlur()}
                InputProps={isPassword ? {
                  endAdornment: <ShowPassword
                    isPassword={isPassword}
                    passwordType={passwordType}
                    handleShowPassword={handleClickShowPassword}
                  />,
                } : clearable ? {
                  endAdornment: <IconButton aria-label="clear" onClick={handleClearField ?
                    () => handleClearField(controllerName) : () => { }}>
                    <ClearIcon />
                  </IconButton>
                } : fieldType === 'number' ?
                  {
                    inputProps: { step: notStep ? 'any' : '5' },
                    endAdornment: endAdornment ? endAdornment : <></>
                  } : isSearch ? {
                    endAdornment: <Search />
                  } : endAdornment ? { endAdornment } : undefined}
              />
            </FormControl>
          )}
        />}
    </>
  );
};

export default InputController;
