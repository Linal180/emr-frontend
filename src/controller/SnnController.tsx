// packages block
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, TextField } from "@material-ui/core";
// components block
import ShowPassword from "../components/common/ShowPassword";
// styles, constants, utils and interfaces block
import { useFormStyles } from "../styles/formsStyles";
import { TEXT, SSN_INPUT, SSN_FORMAT } from "../constants";
import { getFilteredSSN, renderLoading, requiredLabel, } from "../utils";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";

const SnnController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, autoFocus, loading,
  disabled, placeholder, className, isHelperText, isHtmlValidate, margin,
}): JSX.Element => {
  const classes = useFormStyles();
  const { control, getValues } = useFormContext();
  const [passwordType, setPasswordType] = useState<PasswordType>(SSN_INPUT);
  
  const inputValue = getValues(controllerName) || ""
  const inputLabel = isRequired ? requiredLabel(controllerLabel || '') : controllerLabel

  const handleClickShowSSN = () => {
    if (passwordType === SSN_INPUT) setPasswordType(TEXT);
    else setPasswordType(SSN_INPUT);
  };

  return (
    <>
      {loading ? renderLoading(inputLabel || '') :
        <Controller
          name={controllerName}
          control={control}
          defaultValue={SSN_FORMAT}
          render={({ field, fieldState: { invalid, error: { message } = {} } }) => (
            <FormControl fullWidth margin={margin || "normal"} error={Boolean(invalid)}>
              <InputLabel shrink htmlFor={controllerName} className={classes.detailTooltipBox}>
                {inputLabel}
              </InputLabel>

              <TextField
                {...field}
                fullWidth
                error={invalid}
                variant="outlined"
                className={className}
                required={isHtmlValidate && isRequired}
                disabled={disabled}
                id={controllerName}
                autoFocus={autoFocus}
                placeholder={placeholder ? placeholder : ""}
                type={fieldType}
                onFocus={() => setPasswordType(TEXT)}
                onBlur={() => setPasswordType(SSN_INPUT)}
                helperText={!isHelperText ? error ? error : message : ""}
                value={passwordType === TEXT ?
                  inputValue
                  : getFilteredSSN(inputValue)}
                InputProps={{
                  endAdornment: <ShowPassword
                    isPassword
                    passwordType={passwordType}
                    handleShowPassword={handleClickShowSSN}
                  />
                }}
              />
            </FormControl>
          )}
        />}
    </>
  );
};

export default (SnnController);
