// packages block
import { FormControl, InputLabel } from "@material-ui/core";
import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputMask from 'react-text-mask';
// components block
// styles, constants, utils and interfaces block
import { SSN_FORMAT, SSN_INPUT, TEXT } from "../constants";
import { CustomInputControlProps, PasswordType } from "../interfacesTypes";
import { useFormStyles } from "../styles/formsStyles";
import { getFilteredSSN, renderLoading, requiredLabel } from "../utils";

const SnnController: FC<CustomInputControlProps> = ({
  isRequired, controllerName, controllerLabel, fieldType, error, autoFocus, loading,
  disabled, placeholder, className, isHelperText, isHtmlValidate, margin,
}): JSX.Element => {
  const classes = useFormStyles();
  const { control, getValues } = useFormContext();
  const [passwordType, setPasswordType] = useState<PasswordType>(SSN_INPUT);

  const inputValue = getValues(controllerName) || ""
  const inputLabel = isRequired ? requiredLabel(controllerLabel || '') : controllerLabel

  // const handleClickShowSSN = () => {
  //   if (passwordType === SSN_INPUT) setPasswordType(TEXT);
  //   else setPasswordType(SSN_INPUT);
  // };

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

              <InputMask
                {...field}
                value={passwordType === TEXT ?
                  inputValue
                  : getFilteredSSN(inputValue)}
                // eslint-disable-next-line no-useless-escape
                mask={[/[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/, '-', /[\d*|\*]/, /[\d*|\*]/, '-', /[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/]}
                onBlur={() => setPasswordType(SSN_INPUT)}
                onFocus={() => setPasswordType(TEXT)}
                showMask={false}
                className={classes.ssnField}
              />

              {/* <TextField
                {...field}
                fullWidth
                error={invalid}
                onFocus={() => setPasswordType(TEXT)}
                onBlur={() => setPasswordType(SSN_INPUT)}
                variant="outlined"
                className={className}
                required={isHtmlValidate && isRequired}
                disabled={disabled}
                id={controllerName}
                // autoFocus={false}
                placeholder={placeholder ? placeholder : ""}
                type={fieldType}

                helperText={!isHelperText ? error ? error : message : ""}
                value={passwordType === TEXT ?
                  inputValue
                  : getFilteredSSN(inputValue)}
                label={''}
                inputProps={{
                  mask: [/[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/, '-', /[\d*|\*]/, /[\d*|\*]/, '-', /[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/, /[\d*|\*]/],
                }}
                InputProps={{
                  inputComponent: ({
                    inputRef,
                    mask,
                    ...rest
                  }) => <InputMask
                      {...rest}
                      ref={(ref) => {
                        inputRef && inputRef(ref ? ref.inputElement : null);
                      }}
                      mask={mask || false}
                      onBlur={() => setPasswordType(SSN_INPUT)}
                      showMask={false}
                    />,
                  endAdornment: <ShowPassword
                    isPassword
                    passwordType={passwordType}
                    handleShowPassword={handleClickShowSSN}
                  />,
                }}
              /> */}
            </FormControl>
          )}
        />}
    </>
  );
};

export default (SnnController);
